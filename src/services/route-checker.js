export function initialize (store, router) {
  router.beforeEach((to, from, next) => {
    const requiresUserAuth = to.matched.some(record => record.meta.requiresUserAuth)
    const requiresAdminAuth = to.matched.some(record => record.meta.requiresAdminAuth)
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
    const requiresGuestAdmin = to.matched.some(record => record.meta.requiresGuestAdmin)
    const isAdmin = store.getters.isAdmin
    const isUser = store.getters.isUser
    // const isUserApproved = store.getters.isUserApproved

    if (requiresGuest) {
      if (isUser) {
        next({ name: 'UserDashboard' })
      } else {
        next()
      }
    } else if (requiresUserAuth) {
      if (!isUser) {
        next({ name: 'UserLogin' })
      } else {
        next()
      }
    } else if (requiresAdminAuth && !isAdmin) {
      next({ name: 'AdminLogin' })
    } else if (requiresGuestAdmin && isAdmin) {
      next({ name: 'AdminDashboard' })
    } else {
      next()
    }

    // if (requiresUserAuth && !isUser) {
    //   next({ name: 'UserLogin' })
    // } else if (requiresGuest && isUser && !isUserApproved) {
    //   next({ name: 'UserApprovalWaiting' })
    // } else if (requiresUserAuth && isUser && isUserApproved) {
    //   next({ name: 'UserDashboard' })
    // } else if (requiresAdminAuth && !isAdmin) {
    //   next({ name: 'AdminLogin' })
    // } else if (requiresGuestAdmin && isAdmin) {
    //   next({ name: 'AdminDashboard' })
    // } else {
    //   next()
    // }
  })
}
