import { PeerNode } from '@hyper-hyper-space/core';
import { HashedLiteral, HashedObject } from '@hyper-hyper-space/core';
import { Identity } from '@hyper-hyper-space/core';
import { MutableReference, MutableSet } from '@hyper-hyper-space/core';
import { SpaceEntryPoint } from '@hyper-hyper-space/core';

import { ChatMessage } from './ChatMessage';

// A simple chat room. Anyone who knows its hash may join it.

class ChatRoom extends HashedObject implements SpaceEntryPoint {

    static className = 'p2p-chat/v0/model/ChatRoom';

    topic?: MutableReference<HashedLiteral>
    messages?: MutableSet<ChatMessage>;

    _node?: PeerNode;

    constructor(topic?: string) {
        super();
        if (topic !== undefined) {
            this.setRandomId();

            this.addDerivedField('topic', new MutableReference());
            this.addDerivedField('messages', new MutableSet());

            this.topic?.setValue(new HashedLiteral(topic));
        }
    }

    init(): void {
        
    }

    validate(_references: Map<string, HashedObject>): boolean {
        return  this.getId() !== undefined &&
                this.checkDerivedField('topic') &&
                this.checkDerivedField('messages');
    }

    say(author: Identity, text: string) {
        let message = new ChatMessage(author, text);
        this.messages?.add(message).then( () => {
            this.getStore().save(this.messages as HashedObject);
        })        
        //this.messages?.saveQueuedOps();
    }

    getMessages() : MutableSet<ChatMessage> {
        if (this.messages === undefined) {
            throw new Error('The chat room has not been initialized, messages are unavailable.');
        }

        return this.messages;
    }

    async startSync(): Promise<void> {

        let resources = this.getResources();

        if (resources === undefined) {
            throw new Error('Cannot start sync: resources not configured.');
        }

        if (resources.config?.id === undefined) {
            throw new Error('Cannot start sync: local identity has not been defined.');
        }

        if (resources.store === undefined) {
            throw new Error('Cannot start sync: a local store has not been configured.')
        }

        this._node = new PeerNode(resources);
        
        this._node.broadcast(this);
        this._node.sync(this);

        this.messages?.loadAndWatchForChanges();
    }
    
    async stopSync(): Promise<void> {

        this._node?.stopBroadcast(this);
        this._node?.stopSync(this);
    }

    getClassName(): string {
        return ChatRoom.className;
    }

}

HashedObject.registerClass(ChatRoom.className, ChatRoom);

export { ChatRoom };