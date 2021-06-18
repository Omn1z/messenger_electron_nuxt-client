import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { IUser} from '~/scripts/user'

export const state = () => ({
    token: null,
    user: {} as IUser,
    settingsOpened: false,
    imageUrl: '',
    alertsMsg: 0,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    isAuth: state => !!state.token,
    needReg: state => !state.user!.registered,
    user: state => state.user,
    setting: state => state.settingsOpened,
    imgSrc: state => state.imageUrl,
    alertsMsg: state => state.alertsMsg
}

export const mutations: MutationTree<RootState> = {
    SET_TOKEN(state, payload) {
        state.token = payload
    },
    SET_USER(state, payload) {
        state.user = payload
    },
    SET_SETTINGS(state, v: boolean) {
        state.settingsOpened = v
    },
    SET_IMAGE_URL(state, v: string) {
        state.imageUrl = v
    },
    INC_MSG_ALERT(state) {
        state.alertsMsg++
    }
}

export interface ITokenRequest
{
    url: string,
    signature: string,
    code: number
}

export const actions: ActionTree<RootState, RootState> = {
    send({commit}, payload) {
        return new Promise((resolve, reject) => {
            this.$axios.get('/api/auth/generate', {
                params: payload
            }).then((response) => {
                resolve(response)
            }).catch(e => {
                reject(e)
            })
        })
    },
    token({commit, dispatch}, payload: ITokenRequest) {
        return new Promise((resolve, reject) => {
            this.$axios.get(`${payload.url}${payload.code}`, {
                params: {
                    signature: payload.signature
                }
            }).then((response) => {
                if(response.status === 200) {
                    commit('SET_TOKEN', response.data.token)
                }
                resolve(response)
            }).catch(e => {
                reject(e)
            })
        })
    },
    update({commit, getters}) {
        return new Promise((resolve: (value?: unknown) => void, reject) => {
            if(getters.isAuth) {
                this.$axios.get('/api/auth/update').then(response => {
                    if(response.status === 200) {
                        commit('SET_TOKEN', response.data.token.token)
                        commit('SET_USER', response.data.user)
                    }
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            } else {
                resolve()
            }
        })
    },
    logout({commit}) {
        commit('SET_TOKEN', null)
    },
}
