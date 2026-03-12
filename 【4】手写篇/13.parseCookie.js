export const getParsedCookie = (cookieOrigin) => {
  const res = {}
  const cookies = cookieOrigin ? cookieOrigin.split(";") : document.cookie.split(";")

  cookies.forEach((cookie) => {
    const cookieTrim = cookie.trim()
    const indexOfFirstEqualSign = cookieTrim.indexOf("=")
    const cookieName = cookieTrim.substring(0, indexOfFirstEqualSign)
    const cookieContent = cookieTrim.slice(indexOfFirstEqualSign + 1)
    res[cookieName] = cookieContent.includes("=") ? {} : cookieContent

    if (cookieContent.includes("=")) {
      cookieContent.split("&").forEach((content) => {
        const [key, value] = content.split("=")
        res[cookieName][key] = value
      })
    }
  })
  return res;
}

const cookie = "TUI=history_query=0&people_query=1&information_query=1&custom_search_query=0&custom_search_advanced=0&attachment_text_field=0&search_description=1&expert_fields=1; VERSION-%E5%8F%AF%E8%A7%86%E5%8C%96=11.1; LASTORDER=changeddate%2Cshort_desc%2Cpriority%2Cbug_severity; COLUMNLIST=product%20assigned_to%20bug_status%20short_desc%20changeddate%20version%20reporter; DEFAULTFORMAT=specific"

console.log(getParsedCookie(cookie))