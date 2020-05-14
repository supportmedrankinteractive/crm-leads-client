export function initialize (store, router) {
  router.beforeEach((to, from, next) => {
    const requiresUserAuth = to.matched.some(record => record.meta.requiresUserAuth)
    const requiresAdminAuth = to.matched.some(record => record.meta.requiresAdminAuth)
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
    const requiresGuestAdmin = to.matched.some(record => record.meta.requiresGuestAdmin)
    const isAdmin = store.getters.isAdmin
    const isUser = store.getters.isUser
    // const isUserApproved = store.getters.isUserApproved

    if (requiresGuest || to.path === '/') {
      if (isUser) {
        next({ name: 'User Dashboard' })
      } else {
        if (to.path === '/') {
          next({ name: 'User Login' })
        } else {
          next()
        }
      }
    } else if (requiresUserAuth) {
      if (!isUser) {
        next({ name: 'User Login' })
      } else {
        next()
      }
    } else if (requiresAdminAuth && !isAdmin) {
      next({ name: 'Admin Login' })
    } else if (requiresGuestAdmin && isAdmin) {
      next({ name: 'Admin Dashboard' })
    } else {
      next()
    }
  })
}
