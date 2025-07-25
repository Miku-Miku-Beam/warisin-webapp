// // lib/rabbitmq-manager.ts
// import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
// import { EventEmitter } from 'events';

// export interface QueueConfig {
//   durable?: boolean;
//   exclusive?: boolean;
//   autoDelete?: boolean;
//   arguments?: any;
// }

// export interface MessageOptions {
//   persistent?: boolean;
//   priority?: number;
//   expiration?: string;
// }

// export interface ConsumerOptions {
//   noAck?: boolean;
//   exclusive?: boolean;
//   priority?: number;
//   consumerTag?: string;
// }

// // Enum untuk connection states
// export enum ConnectionState {
//   DISCONNECTED = 'disconnected',
//   CONNECTING = 'connecting',
//   CONNECTED = 'connected',
//   ERROR = 'error'
// }


// class RabbitMQManager extends EventEmitter {
//   private connection: Connection | null = null;
//   private channel: Channel | null = null;
//   private state: ConnectionState = ConnectionState.DISCONNECTED;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectDelay = 5000;
//   private connectionPromise: Promise<void> | null = null;

//   constructor(
//     private connectionUrl: string,
//     private options: {
//       maxReconnectAttempts?: number;
//       reconnectDelay?: number;
//       heartbeat?: number;
//     } = {}
//   ) {
//     super();
    
//     this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
//     this.reconnectDelay = options.reconnectDelay ?? 5000;
    
//     if (!connectionUrl) {
//       throw new Error('RabbitMQ connection URL is required');
//     }
//   }

//   // Public method untuk connect
//   public async connect(): Promise<void> {
//     if (this.state === ConnectionState.CONNECTED) {
//       return;
//     }

//     if (this.state === ConnectionState.CONNECTING && this.connectionPromise) {
//       return this.connectionPromise;
//     }

//     this.connectionPromise = this.establishConnection();
//     return this.connectionPromise;
//   }

//   // Private method untuk establish connection
//   private async establishConnection(): Promise<void> {
//     this.setState(ConnectionState.CONNECTING);
    
//     try {
//       console.log('🔗 Connecting to RabbitMQ...');
      
//       const connectionOptions = {
//         heartbeat: this.options.heartbeat ?? 60,
//       };
      
// this.connection = await amqp.connect(this.connectionUrl)  ;
//       this.channel = await this.connection.createChannel();
      
//       // Setup connection event handlers
//       this.connection.on('error', this.handleConnectionError.bind(this));
//       this.connection.on('close', this.handleConnectionClose.bind(this));
      
//       // Setup channel event handlers
//       this.channel.on('error', this.handleChannelError.bind(this));
//       this.channel.on('close', this.handleChannelClose.bind(this));
      
//       this.setState(ConnectionState.CONNECTED);
//       this.reconnectAttempts = 0;
//       this.connectionPromise = null;
      
//       console.log('✅ Connected to RabbitMQ successfully');
//       this.emit('connected');
      
//     } catch (error) {
//       this.setState(ConnectionState.ERROR);
//       this.connectionPromise = null;
//       console.error('❌ Failed to connect to RabbitMQ:', error);
//       this.emit('error', error);
      
//       // Auto reconnect logic
//       await this.scheduleReconnect();
//       throw error;
//     }
//   }

//   // Event handlers
//   private handleConnectionError(error: Error): void {
//     console.error('🚨 RabbitMQ connection error:', error);
//     this.setState(ConnectionState.ERROR);
//     this.emit('connectionError', error);
//   }

//   private handleConnectionClose(): void {
//     console.warn('⚠️ RabbitMQ connection closed');
//     this.setState(ConnectionState.DISCONNECTED);
//     this.cleanup();
//     this.emit('connectionClosed');
//     this.scheduleReconnect();
//   }

//   private handleChannelError(error: Error): void {
//     console.error('🚨 RabbitMQ channel error:', error);
//     this.emit('channelError', error);
//   }

//   private handleChannelClose(): void {
//     console.warn('⚠️ RabbitMQ channel closed');
//     this.channel = null;
//     this.emit('channelClosed');
//   }

//   // Auto reconnect logic
//   private async scheduleReconnect(): Promise<void> {
//     if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//       console.error(`❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached`);
//       this.emit('maxReconnectAttemptsReached');
//       return;
//     }

//     this.reconnectAttempts++;
//     const delay = this.reconnectDelay * this.reconnectAttempts;
    
//     console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
//     setTimeout(() => {
//       this.connect().catch(error => {
//         console.error('Reconnection failed:', error);
//       });
//     }, delay);
//   }

//   // Utility methods
//   private setState(newState: ConnectionState): void {
//     if (this.state !== newState) {
//       const oldState = this.state;
//       this.state = newState;
//       this.emit('stateChanged', { from: oldState, to: newState });
//     }
//   }

//   private cleanup(): void {
//     this.connection = null;
//     this.channel = null;
//   }

//   // Public methods untuk queue operations
//   public async assertQueue(queueName: string, options: QueueConfig = {}): Promise<void> {
//     await this.ensureConnection();
//     if (!this.channel) throw new Error('Channel not available');
    
//     const queueOptions = {
//       durable: true,
//       ...options
//     };
    
//     await this.channel.assertQueue(queueName, queueOptions);
//     console.log(`📝 Queue '${queueName}' asserted`);
//   }

//   public async sendToQueue(
//     queueName: string, 
//     message: any, 
//     options: MessageOptions = {}
//   ): Promise<boolean> {
//     await this.ensureConnection();
//     if (!this.channel) throw new Error('Channel not available');
    
//     // Assert queue dulu
//     await this.assertQueue(queueName);
    
//     const messageOptions = {
//       persistent: true,
//       ...options
//     };
    
//     const buffer = Buffer.from(JSON.stringify(message));
//     const sent = this.channel.sendToQueue(queueName, buffer, messageOptions);
    
//     if (sent) {
//       console.log(`📤 Message sent to queue '${queueName}'`);
//     } else {
//       console.warn(`⚠️ Message could not be sent to queue '${queueName}'`);
//     }
    
//     return sent;
//   }

//   public async consume(
//     queueName: string,
//     callback: (message: ConsumeMessage | null) => void | Promise<void>,
//     options: ConsumerOptions = {}
//   ): Promise<{ consumerTag: string }> {
//     await this.ensureConnection();
//     if (!this.channel) throw new Error('Channel not available');
    
//     // Assert queue dulu
//     await this.assertQueue(queueName);
    
//     const consumerOptions = {
//       noAck: false,
//       ...options
//     };
    
//     const result = await this.channel.consume(queueName, callback, consumerOptions);
//     console.log(`👂 Consumer started for queue '${queueName}' with tag '${result.consumerTag}'`);
    
//     return result;
//   }

//   public async ack(message: ConsumeMessage): Promise<void> {
//     if (!this.channel) throw new Error('Channel not available');
//     this.channel.ack(message);
//   }

//   public async nack(message: ConsumeMessage, requeue = true): Promise<void> {
//     if (!this.channel) throw new Error('Channel not available');
//     this.channel.nack(message, false, requeue);
//   }

//   public async publishToExchange(
//     exchangeName: string,
//     routingKey: string,
//     message: any,
//     options: MessageOptions = {}
//   ): Promise<boolean> {
//     await this.ensureConnection();
//     if (!this.channel) throw new Error('Channel not available');
    
//     const messageOptions = {
//       persistent: true,
//       ...options
//     };
    
//     const buffer = Buffer.from(JSON.stringify(message));
//     const published = this.channel.publish(exchangeName, routingKey, buffer, messageOptions);
    
//     if (published) {
//       console.log(`📤 Message published to exchange '${exchangeName}' with routing key '${routingKey}'`);
//     }
    
//     return published;
//   }

//   // Health check method
//   public isHealthy(): boolean {
//     return this.state === ConnectionState.CONNECTED && 
//            this.connection !== null && 
//            this.channel !== null &&
//            !this.connection.closed;
//   }

//   public getState(): ConnectionState {
//     return this.state;
//   }

//   // Graceful shutdown
//   public async close(): Promise<void> {
//     try {
//       console.log('🔌 Closing RabbitMQ connection...');
      
//       if (this.channel && !this.channel.closed) {
//         await this.channel.close();
//       }
      
//       if (this.connection && !this.connection.closed) {
//         await this.connection.close();
//       }
      
//       this.cleanup();
//       this.setState(ConnectionState.DISCONNECTED);
//       console.log('✅ RabbitMQ connection closed gracefully');
//       this.emit('closed');
      
//     } catch (error) {
//       console.error('❌ Error closing RabbitMQ connection:', error);
//       throw error;
//     }
//   }

//   private async ensureConnection(): Promise<void> {
//     if (!this.isHealthy()) {
//       await this.connect();
//     }
//   }
// }

// // Singleton instance
// let rabbitMQInstance: RabbitMQManager | null = null;

// export function getRabbitMQManager(): RabbitMQManager {
//   if (!rabbitMQInstance) {
//     const connectionUrl = process.env.RABBITMQ_URI;
//     if (!connectionUrl) {
//       throw new Error('RABBITMQ_URI environment variable is required');
//     }
    
//     rabbitMQInstance = new RabbitMQManager(connectionUrl, {
//       maxReconnectAttempts: 5,
//       reconnectDelay: 5000,
//       heartbeat: 60
//     });
//   }
  
//   return rabbitMQInstance;
// }

// // Helper function untuk graceful shutdown
// export async function closeRabbitMQConnection(): Promise<void> {
//   if (rabbitMQInstance) {
//     await rabbitMQInstance.close();
//     rabbitMQInstance = null;
//   }
// }

// // Export types
// export { ConnectionState, RabbitMQManager };
