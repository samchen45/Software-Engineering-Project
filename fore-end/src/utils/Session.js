const LOGIN_COOKIE_NAME = 'S_N'


export function isAuthenticated () {
  return _getCookie(LOGIN_COOKIE_NAME)
}

export function isAuthenticatedid () {
  return _getCookie_id(LOGIN_COOKIE_NAME)
}

export function isAuthenticatedtype () {
  return _getCookie_type(LOGIN_COOKIE_NAME)
}

export function authenticateSuccess (token) {
  _setCookie(LOGIN_COOKIE_NAME, token)
}

export function logout () {

  _setCookie(LOGIN_COOKIE_NAME, '', 0)

}

function _getCookie_type (name) {
  let start, end, start2, start3
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    console.log(document.cookie)
    if (start !== -1) {
      start = start + name.length + 1
      start2 = document.cookie.indexOf('D', start) + 1
      start3 = document.cookie.indexOf('D', start2) + 1
      end = document.cookie.indexOf('%', start3)
      
      if (end === -1) {
        end = document.cookie.length
      }
      console.log(document.cookie.substring(start3, end))
      return unescape(document.cookie.substring(start3, end))
    }
  }
  return ''
}

function _getCookie_id (name) {
  let start, end, start2
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    console.log(document.cookie)
    if (start !== -1) {
      start = start + name.length + 1
      start2 = document.cookie.indexOf('D', start) + 1
      end = document.cookie.indexOf('%', start2)
      
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start2, end))
    }
  }
  return ''
}

function _getCookie (name) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf('%', start)
      if (end === -1) {
        end = document.cookie.length
      }
      console.log(document.cookie.substring(start, end))
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

function _setCookie (name, value, expire) {
  let date = new Date()

  date.setDate(date.getDate() + expire)
  document.cookie = name + '=' + escape(value) + '; path=/' +
    (expire ? ';expires=' + date.toGMTString() : '')
  console.log(document.cookie)
}