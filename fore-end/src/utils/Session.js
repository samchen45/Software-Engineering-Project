const LOGIN_COOKIE_NAME = 'sessionId'

export function isAuthenticated () {
  return _getCookie(LOGIN_COOKIE_NAME)
}

export function isAuthenticatedid () {
  return _getCookie_id(LOGIN_COOKIE_NAME)
}

export function authenticateSuccess (token1,token2) {
  _setCookie(LOGIN_COOKIE_NAME, token1, token2)
}

export function logout () {
  _setCookie(LOGIN_COOKIE_NAME, '', 0)
}
function _getCookie (name) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      start2 = document.cookie.indexOf(';', start)
      end = document.cookie.indexOf(';', start2)
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
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

function _setCookie (name, value1,value2, expire) {
  let date = new Date()
  date.setDate(date.getDate() + expire)
  document.cookie = name + '=' + escape(value1) + ';'+escape(value2) +';path=/' +
    (expire ? ';expires=' + date.toGMTString() : '')
}