export interface Check {
    id: string
    projectId: string
    type: string
    name: string
    tokenHash: string
    target: string
    intervalSec: number
    timeoutMs: number
    successCodes: number[]
    createdAt: string
    updatedAt: string
    runs: CheckRun[]
    enabled: boolean
}

export interface CheckRun {
    id: string
    checkId: string
    ts: string
    latencyMs: number
    ok: boolean
    code: number
    errorMsg: string
}