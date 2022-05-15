

function getMenuData() {
  return JSON.parse(sessionStorage.getItem('authedRoutes') as string);
}

function hasAuth(list: string | any[], name: any) {
  return list.indexOf(name) > -1;
}

export const AuthConsumer = (name: any) => {
  let router = getMenuData();
  let route = window.location.hash.split('#')[1]
  console.log(route)
  let auth: any[] = [];
  const getAuth = (router: any[]) => {
    router.map((item: { path: string; children: any[]; }) => {
      if (item.path == route) {
        auth = item.children;
      }
      if (item.children) {
        getAuth(item.children);
      }
    });
    return auth;
  };
  let allAuth = getAuth(router);
  let list: any[] = [];
  allAuth.map((i) => {
    list.push(i.name);
  });
  const hasAuthResult = hasAuth(list, name);
  return hasAuthResult;
};
