import Service from './api'

export const downloadFile = (filename: string, type: string, url: string, fullname?: string) => {
  fetch(url)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('style', 'display: none')
      a.setAttribute('href', url)
      a.setAttribute('download', fullname || `${filename}.${type}`)
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      ElMessage.success(`${filename}下载成功`)
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(`${filename}下载失败`)
    })
}
//文件导出公共方法
export const exportFile = (url: string, data: object, name: string, type = 'POST') => {
  let parmas = {
    method: type,
    responseType: 'blob',
    headers: new Headers({
      'Content-Type': 'application/json; charset=utf-8;access-control-allow-origin',
      Accept: 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('bizAccessToken')
    }),
    body: window.JSON.stringify(data)
  }
  fetch(url, {
    ...parmas
  }).then((res) => {
    if (res.status === 400) {
      res.json().then((data) => {
        ElMessage.error(data.data)
      })
    } else {
      res.blob().then((blob) => {
        var alink = document.createElement('a')
        alink.style.display = 'none'
        alink.download = name
        alink.href = window.URL.createObjectURL(blob)
        document.body.appendChild(alink)
        alink.click()
        URL.revokeObjectURL(alink.href) // 释放URL 对象
        document.body.removeChild(alink)
        ElMessage.success(`${name}导出成功`)
      })
    }
  })
}
//文件预览
export const readPreview = (id: number) => {
  Service.readPreview({ id }).then((res) => {
    window.open(res.data)
  })
}
