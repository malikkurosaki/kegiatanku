
export type AppRoute = "/shalat" | "/shalat/shalat" | "/login" | "/" | "/register" | "/dashboard" | "/dashboard/shalat" | "/dashboard/shalat/dashboard-shalat" | "/dashboard/config" | "/dashboard/config/config" | "/dashboard/apikey/apikey" | "/dashboard/dashboard" | "/profile" | "/profile/profile";

export function route(path: AppRoute, params?: Record<string,string|number>) {
  if (!params) return path;
  let final = path;
  for (const k of Object.keys(params)) {
    final = final.replace(":" + k, params[k] + "") as AppRoute;
  }
  return final;
}
