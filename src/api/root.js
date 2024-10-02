import { API_TAMS } from "./API_TAMS"

export const dataPreprocessing = async () => {
  const uri = `/api-test`
  const res = await API_TAMS.get(uri)
  return res
}