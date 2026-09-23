import DefaultTheme from 'vitepress/theme'
import CourseTiles from './components/CourseTiles.vue'
import MemberDashboard from './components/MemberDashboard.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import ExerciseBox from './components/ExerciseBox.vue'
import QuizBox from './components/QuizBox.vue'
import { userStore } from './stores/userStore'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CourseTiles', CourseTiles)
    app.component('MemberDashboard', MemberDashboard)
    app.component('AdminDashboard', AdminDashboard)
    app.component('ExerciseBox', ExerciseBox)
    app.component('QuizBox', QuizBox)

    // Synchronisation Cloud automatique en arrière-plan dès le chargement de n'importe quelle page dans le navigateur
    if (typeof window !== 'undefined') {
      try {
        userStore.syncFromStorage()
        userStore.syncWithCloud().catch(() => {})
      } catch (e) {}
    }
  }
}
