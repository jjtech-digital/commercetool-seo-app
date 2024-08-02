import { secrets } from "./secrets"
export const getCode = (key : string) => {
    return secrets[key] || process.env[key]
}