import { reactive } from 'vue'

const STORAGE_KEY_CLOUD_URL = 'hech_prepa_cloud_url'
const STORAGE_KEY_LAST_SYNC = 'hech_prepa_last_sync'

// URL officielle de déploiement Google Apps Script (connectée au Google Drive & Sheet de Jérôme)
export const DEFAULT_CLOUD_URL = 'https://script.google.com/macros/s/AKfycbyXrQliTRTuzUZHcP54tjGb9KMRlznKHODC08561nTw1_5h1wjHYa_GpBc30UfrcUFg9w/exec'

export interface CloudSyncState {
  url: string
  isSyncing: boolean
  lastSyncTime: number | null
  syncError: string | null
  isOnline: boolean
}

export const cloudSyncState = reactive<CloudSyncState>({
  url: typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY_CLOUD_URL) || DEFAULT_CLOUD_URL) : DEFAULT_CLOUD_URL,
  isSyncing: false,
  lastSyncTime: typeof window !== 'undefined' ? Number(localStorage.getItem(STORAGE_KEY_LAST_SYNC) || 0) : null,
  syncError: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
})

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { cloudSyncState.isOnline = true })
  window.addEventListener('offline', () => { cloudSyncState.isOnline = false })
}

export class CloudSync {
  getUrl(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_CLOUD_URL)
      if (stored && stored.trim().length > 15) return stored.trim()
      const webhook = localStorage.getItem('hech_prepa_drive_webhook')
      if (webhook && webhook.trim().length > 15) return webhook.trim()
    }
    return cloudSyncState.url || DEFAULT_CLOUD_URL
  }

  setUrl(newUrl: string) {
    const clean = (newUrl || '').trim() || DEFAULT_CLOUD_URL
    cloudSyncState.url = clean
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CLOUD_URL, clean)
      localStorage.setItem('hech_prepa_drive_webhook', clean)
    }
  }

  hasConfiguredUrl(): boolean {
    return !!this.getUrl()
  }

  private async postJson(payload: any, timeoutMs = 12000): Promise<any> {
    const url = this.getUrl()
    if (!url) return null

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      // Utilisation de Content-Type: text/plain pour éviter les requêtes pré-vol OPTIONS avec Google Apps Script
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
      clearTimeout(timer)
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`)
      }
      const data = await res.json().catch(() => null)
      return data
    } catch (err: any) {
      clearTimeout(timer)
      console.warn('[CloudSync] Erreur postJson:', err.message)
      throw err
    }
  }

  private async getJson(params: Record<string, string>, timeoutMs = 10000): Promise<any> {
    const baseUrl = this.getUrl()
    if (!baseUrl) return null

    const url = new URL(baseUrl)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        signal: controller.signal
      })
      clearTimeout(timer)
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`)
      }
      return await res.json().catch(() => null)
    } catch (err: any) {
      clearTimeout(timer)
      console.warn('[CloudSync] Erreur getJson:', err.message)
      throw err
    }
  }

  /**
   * Récupère la totalité des données distantes et les fusionne
   */
  async syncAll(localState: any): Promise<{ success: boolean; data?: any; message?: string }> {
    const url = this.getUrl()
    if (!url) {
      return { success: false, message: 'URL Cloud non configurée.' }
    }

    cloudSyncState.isSyncing = true
    cloudSyncState.syncError = null

    try {
      // On tente d'abord un POST avec l'état local pour effectuer un merge bidirectionnel sur le serveur
      const response = await this.postJson({
        action: 'syncAll',
        state: {
          users: localState.users || [],
          submissions: localState.submissions || [],
          deadlines: localState.deadlines || {},
          quizAttempts: localState.quizAttempts || [],
          evaluations: localState.evaluations || {}
        }
      })

      if (response && response.status === 'success') {
        const now = Date.now()
        cloudSyncState.lastSyncTime = now
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_LAST_SYNC, String(now))
        }
        cloudSyncState.isSyncing = false
        return { success: true, data: response.data }
      }

      // Fallback via GET si le POST a retourné une réponse inattendue
      const getData = await this.getJson({ action: 'syncAll' })
      if (getData && getData.status === 'success') {
        const now = Date.now()
        cloudSyncState.lastSyncTime = now
        cloudSyncState.isSyncing = false
        return { success: true, data: getData.data }
      }

      throw new Error(response?.message || 'Réponse invalide du serveur Cloud.')
    } catch (err: any) {
      cloudSyncState.isSyncing = false
      cloudSyncState.syncError = err.message
      return { success: false, message: err.message }
    }
  }

  /**
   * Recherche un étudiant en ligne par son email (permet la connexion cross-device immédiate)
   */
  async fetchStudent(email: string): Promise<any | null> {
    const url = this.getUrl()
    if (!url) return null

    try {
      const cleanEmail = email.trim().toLowerCase()
      // Tenter d'abord par GET
      const res = await this.getJson({ action: 'getStudent', email: cleanEmail })
      if (res && res.status === 'success' && res.user) {
        return res.user
      }

      // Sinon tenter via POST
      const postRes = await this.postJson({ action: 'getStudent', email: cleanEmail })
      if (postRes && postRes.status === 'success' && postRes.user) {
        return postRes.user
      }
    } catch (e) {
      console.warn('[CloudSync] fetchStudent failed:', e)
    }
    return null
  }

  /**
   * Envoie une nouvelle inscription étudiante
   */
  async pushStudent(user: any): Promise<boolean> {
    if (!this.hasConfiguredUrl()) return false
    try {
      await this.postJson({ action: 'registerStudent', user })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Envoie une mise à jour d'étudiant (ex: mot de passe défini)
   */
  async pushUpdateStudent(user: any): Promise<boolean> {
    if (!this.hasConfiguredUrl()) return false
    try {
      await this.postJson({ action: 'updateStudent', user })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Supprime un étudiant distant (Google Sheet)
   */
  async deleteStudent(email: string): Promise<boolean> {
    if (!this.hasConfiguredUrl() || !email) return false
    try {
      await this.postJson({ action: 'deleteStudent', email: email.trim().toLowerCase() })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Envoie une soumission d'exercice rédigée
   */
  async pushSubmission(submission: any): Promise<boolean> {
    if (!this.hasConfiguredUrl()) return false
    try {
      await this.postJson({ action: 'saveSubmission', submission })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Envoie un résultat de quiz
   */
  async pushQuizAttempt(quizAttempt: any): Promise<boolean> {
    if (!this.hasConfiguredUrl()) return false
    try {
      await this.postJson({ action: 'saveQuizAttempt', quizAttempt })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Envoie la configuration des échéances
   */
  async pushDeadlines(deadlines: any): Promise<boolean> {
    if (!this.hasConfiguredUrl()) return false
    try {
      await this.postJson({ action: 'saveDeadlines', deadlines })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Envoie une évaluation / note enseignant
   */
  async pushEvaluation(email: string, evaluation: any): Promise<boolean> {
    if (!this.hasConfiguredUrl()) return false
    try {
      await this.postJson({ action: 'saveEvaluation', email, evaluation })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Téléversement de fichier vers Google Apps Script -> Google Drive
   */
  async uploadFile(filePayload: {
    studentName: string
    studentEmail: string
    exerciseTitle: string
    fileName: string
    base64Data: string
    mimeType: string
  }): Promise<{ success: boolean; fileId?: string; fileUrl?: string; message?: string }> {
    if (!this.hasConfiguredUrl()) {
      return { success: false, message: 'URL Google Apps Script non configurée.' }
    }
    try {
      const res = await this.postJson({
        action: 'uploadFile',
        ...filePayload
      }, 30000)
      if (res && (res.status === 'success' || res.fileId)) {
        return {
          success: true,
          fileId: res.fileId,
          fileUrl: res.fileUrl || res.webViewLink,
          message: 'Fichier sauvegardé dans Google Drive !'
        }
      }
      return { success: false, message: res?.message || 'Échec du dépôt Google Drive.' }
    } catch (err: any) {
      return { success: false, message: err.message }
    }
  }
}

export const cloudSync = new CloudSync()
