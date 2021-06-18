import { IUser } from './user'
import {io, Socket} from "socket.io-client"
import {DateTime} from "luxon"
import { moveArrayElementTo } from './utils'

export interface IAsset {
    id: number,
    type: number,
    name: string,
    data: string,
    url: string,
}

export interface IMessage {
    message_id: number,
    channel_id: number,
    author_id: number,
    reply: boolean,
    message: string,
    read_state: boolean,
    created_at: string,
    forwards: Array<IMessage>
    assets: Array<IAsset>
}

export interface ITextChannel {
    id: number,
    type: number,
    name: string,
    message_at: string,
    members: Array<IUser>
    messages: Array<IMessage>
}

export class ChannelState {
    public scrollTop: number = -1
    public typeUsers: Array<IUser> = []
    constructor(public channel: ITextChannel, public socket: Socket, public parent: ChannelsState) {
        socket.on('new:message', this.newMessage.bind(this))
        socket.on('read:message', this.readMessage.bind(this))
        socket.on('type:enabled', this.enableTyping.bind(this))
        socket.on('type:disable', this.disableTyping.bind(this))
        socket.on('load:messages', this.loadMessages.bind(this))
        socket.on('user:changed', this.userChanged.bind(this))
    }
    private userChanged(user: IUser) {
        const idx = this.channel.members.findIndex(s => s.uid === user.uid)
        if(idx !== -1) {
            this.channel.members[idx] = user
            this.channel.members.push(user)
            this.channel.members.splice(idx, 1)
        }
    }
    private loadMessages(messages: Array<IMessage>) {
        for (const message of messages) {
            this.channel.messages.push(message)
        }
    }
    public queryMessages(lastMessageId: number) {
        this.socket.emit('load:messages', lastMessageId)
    }
    public get isPrivate() {
        return this.channel.type === 2
    }
    public get messages() {
        return this.channel.messages
    }
    private enableTyping(params: any) {
        const idx = this.channel.members.findIndex(user => user.uid === params.uid)
        if(idx !== -1) {
            if(this.typeUsers.findIndex(user => user.uid === params.uid) === -1) {
                this.typeUsers.push(this.channel.members[idx])
            }
        }
    }
    private disableTyping(params: any) {
        const idx = this.typeUsers.findIndex(user => user.uid === params.uid)
        if(idx !== -1) {
            this.typeUsers.splice(idx, 1)
        }
    }
    private newMessage(msg: IMessage) {
        this.channel.messages.unshift(msg)
        this.channel.message_at = msg.created_at
        const channel_id = this.channel.id
        moveArrayElementTo(this.parent.channels, this.parent.channels.findIndex(state => {
            return state.channel.id === channel_id
        }) ,0)
    }
    private readMessage(message_id: number) {
        const idx = this.channel.messages.findIndex(msg => msg.message_id === message_id)
        if(idx !== -1) {
            this.channel.messages[idx].read_state = true
        }
    }
    public read(msg: IMessage) {
        msg.read_state = true
        this.socket.emit('read:message', msg.message_id)
    }
    public changeType(value: boolean) {
        this.socket.emit(value ? 'type:enabled' : 'type:disable')
    }
}

export interface SearchChannelContext {
    user?: IUser,
    channel?: ChannelState
}

export interface SearchChannelResponse {
    user?: IUser,
    channel?: ITextChannel
}

export class ChannelsState {
    public channels = [] as ChannelState[]
    public selectedChannel: ChannelState | undefined = undefined
    public loaded: boolean = false
    public search: Array<SearchChannelContext> = []
    public socket?: Socket

    public front (channel: ChannelState) {
        this.channels.unshift(channel)
    }
    public listen (channel: ChannelState) {
        this.channels.push(channel)
    }
    public createThenSelect (channel: ChannelState) {
        this.channels.unshift(channel)
        this.selectedChannel = channel
    }
    public queryChannels(lastMessageAt: string) {
        this.socket!.emit('load:channels', lastMessageAt)
    }
    public sort() {
        this.channels.sort((a: ChannelState, b: ChannelState) =>
            DateTime.fromISO(b.channel.message_at).toMillis() - DateTime.fromISO(a.channel.message_at).toMillis());
    }
    public select(channel: ChannelState) {
        this.selectedChannel = channel
    }

    public close() {
        this.loaded = false
        this.selectedChannel = undefined
        for (const channel of this.channels) {
            channel.socket.disconnect()
        }
        this.search = []
        this.channels = []
        if(this.socket) {
            this.socket.disconnect()
        }
    }
}
