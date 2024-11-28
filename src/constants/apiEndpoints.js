const API_URL = "http://localhost:5000"
export const API_ENCRYPT = API_URL + "/api/url/encrypt"
export const API_DECRYPT = API_URL + "/api/url/decrypt"
export const API_VERIFY_DEPENDENTS_CPF_EMERGPHONE = API_URL + "/api/dependent/commonuser/verifyDependentsCPFandEmergPhone/params"
export const API_DEPENDENT_FOUND_BY_ID = API_URL + "/api/dependent/commonuser/findById/"
export const API_SMSHANDLER_SENDER = API_URL + "/api/smshandler/"
export const API_SMSHANDLER_VERIFY_CODE = API_URL + "/api/smshandler/verifySmsCode"
export const API_SMS_SCANHISTORY = API_URL + "/api/scanHistory"

export const API_FIND_BY_TELEFONE = API_URL + "/api/responsible/findByTelefone/"

export const API_SEND_NOTIFICATION_RESPONSIBLE = API_URL + "/api/notifications/sendAndStore"

export const API_FIND_NOME_DEP = API_URL + "/api/dependent/findDependentNameByCpf/"