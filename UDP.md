**UDP Sockets**

The standard transport protocols riding above the IP layer are TCP and UDP. As we saw in Chapter 1, UDP provides simple datagram delivery to remote sockets, that is, to ⟨host,port⟩ pairs. TCP provides a much richer functionality for sending data, but requires that the remote socket first be connected. In this chapter, we start with the much-simpler UDP, including the UDP-based Trivial File Transfer Protocol.

We also review some fundamental issues any transport protocol must address, such as lost final packets and packets arriving late enough to be subject to misinterpretation upon arrival. These fundamental issues will be equally applicable to TCP connections.

UDP as “almost a null protocol”; while that is something of a harsh assessment, UDP is indeed fairly basic. The two features it adds beyond the IP layer are port numbers and a checksum. The UDP header consists of the following:

The port numbers are what makes UDP into a real transport protocol: with them, an application can now connect to an individual server process (that is, the process “owning” the port number in question), rather than simply to a host.

UDP is unreliable, in that there is no UDP-layer attempt at timeouts, acknowledgment and retransmission; applications written for UDP must implement these. As with TCP, a UDP ⟨host,port⟩ pair is known as a socket (though UDP ports are considered a separate namespace from TCP ports). UDP is also unconnected, or stateless; if an application has opened a port on a host, any other host on the Internet may deliver packets to that ⟨host,port⟩ socket without preliminary negotiation.

UDP packets use the 16-bit Internet checksum (7.4   Error Detection) on the data. While it is seldom done today, the checksum can be disabled by setting the checksum field to the all-0-bits value, which never occurs as an actual ones-complement sum. The UDP checksum covers the UDP header, the UDP data and also a “pseudo-IP header” that includes the source and destination IP addresses (and also a duplicate copy of the UDP-header length field). If a NAT router rewrites an IP address or port, the UDP checksum must be updated.

UDP packets can be dropped due to queue overflows either at an intervening router or at the receiving host. When the latter happens, it means that packets are arriving faster than the receiver can process them. Higher-level protocols that define ACK packets (eg UDP-based RPC, below) typically include some form of flow control to prevent this.

UDP is popular for “local” transport, confined to one LAN. In this setting it is common to use UDP as the transport basis for a Remote Procedure Call, or RPC, protocol. The conceptual idea behind RPC is that one host invokes a procedure on another host; the parameters and the return value are transported back and forth by UDP. We will consider RPC in greater detail below, in 16.5   Remote Procedure Call (RPC); for now, the point of UDP is that on a local LAN we can fall back on rather simple mechanisms for timeout and retransmission.

UDP is well-suited for “request-reply” semantics beyond RPC; one can use TCP to send a message and get a reply, but there is the additional overhead of setting up and tearing down a connection. DNS uses UDP, largely for this reason. However, if there is any chance that a sequence of request-reply operations will be performed in short order then TCP may be worth the overhead.

UDP is also popular for real-time transport; the issue here is head-of-line blocking. If a TCP packet is lost, then the receiving host queues any later data until the lost data is retransmitted successfully, which can take several RTTs; there is no option for the receiving application to request different behavior. UDP, on the other hand, gives the receiving application the freedom simply to ignore lost packets. This approach is very successful for voice and video, which are loss-tolerant in that small losses simply degrade the received signal slightly, but delay-intolerant in that packets arriving too late for playback might as well not have arrived at all. Similarly, in a computer game a lost position update is moot after any subsequent update. Loss tolerance is the reason the Real-time Transport Protocol, or RTP, is built on top of UDP rather than TCP. It is common for VoIP telephone calls to use RTP and UDP. See also the NoTCP Manifesto.

**Protocols built on top of UDP**

Sometimes UDP is used simply because it allows new or experimental protocols to run entirely as user-space applications; no kernel updates are required, as would be the case with TCP changes. Google has created a protocol named QUIC (Quick UDP Internet Connections, chromium.org/quic) in this category, rather specifically to support the HTTP protocol. QUIC can in fact be viewed as a transport protocol specifically tailored to HTTPS: HTTP plus TLS encryption (29.5.2   TLS).

The Datagram Congestion Control Protocol, or DCCP, is another transport protocol build atop UDP, preserving UDP’s fundamental tolerance to packet loss. It is outlined in RFC 4340. DCCP adds a number of TCP-like features to UDP; for our purposes the most significant are connection setup and teardown (see 18.15.3   DCCP) and TCP-like congestion management (see 21.3.3   DCCP Congestion Control).

DCCP data packets, while numbered, are delivered to the application in order of arrival rather than in order of sequence number. DCCP also adds acknowledgments to UDP, but in a specialized form primarily for congestion control. There is no assumption that unacknowledged data packets will ever be retransmitted; that decision is entirely up to the application. Acknowledgments can acknowledge single packets or, through the DCCP acknowledgment-vector format, all packets received in a range of recent sequence numbers (SACK TCP, 19.6   Selective Acknowledgments (SACK), also supports this).

DCCP does support reliable delivery of control packets, used for connection setup, teardown and option negotiation. Option negotiation can occur at any point during a connection.

DCCP packets include not only the usual application-specific UDP port numbers, but also a 32-bit service code. This allows finer-grained packet handling as it unambiguously identifies the processing requested by an incoming packet. The use of service codes also resolves problems created when applications are forced to use nonstandard port numbers due to conflicts.

DCCP is specifically intended to run in in the operating-system kernel, rather than in user space. 

One of the early standard examples for socket programming is simplex-talk. The client side reads lines of text from the user’s terminal and sends them over the network to the server; the server then displays them on its terminal. The server does not acknowledge anything sent to it, or in fact send any response to the client at all. “Simplex” here refers to the one-way nature of the flow; “duplex talk” is the basis for Instant Messaging, or IM.

Even at this simple level we have some details to attend to regarding the data protocol: we assume here that the lines are sent with a trailing end-of-line marker. In a world where different OS’s use different end-of-line marks, including them in the transmitted data can be problematic. However, when we get to the TCP version, if arriving packets are queued for any reason then the embedded end-of-line character will be the only thing to separate the arriving data into lines.

As with almost every Internet protocol, the server side must select a port number, which with the server’s IP address will form the socket address to which clients connect. Clients must discover that port number or have it written into their application code. Clients too will have a port number, but it is largely invisible.

On the server side, simplex-talk must do the following:

    ask for a designated port number
    create a socket, the sending/receiving endpoint
    bind the socket to the socket address, if this is not done at the point of socket creation
    receive packets sent to the socket
    for each packet received, print its sender and its content

The client side has a similar list:

    look up the server’s IP address, using DNS
    create an “anonymous” socket; we don’t care what the client’s port number is
    read a line from the terminal, and send it to the socket address ⟨server_IP,port⟩


**The Server**

The socket-creation and port-binding operations are combined into the single operation new DatagramSocket(destport). Once created, this socket will receive packets from any host that addresses a packet to it; there is no need for preliminary connection. In the original BSD socket library, a socket is created with socket() and bound to an address with the separate operation bind().

The server application needs no parameters; it just starts. (That said, we could make the port number a parameter, to allow easy change.) The server accepts both IPv4 and IPv6 connections; we return to this below.

Though it plays no role in the protocol, we will also have the server time out every 15 seconds and display a message, just to show how this is done. Implementations of real UDP protocols essentially always must arrange when attempting to receive a packet to time out after a certain interval with no response.

The server line s = new DatagramSocket(destport) creates a DatagramSocket object bound to the given port

To experiment with these on a single host, start the server in one window and one or more clients in other windows. One can then try the following:

    have two clients simultaneously running, and sending alternating messages to the same server
    invoke the client with the external IP address of the server in dotted-decimal, eg 10.0.0.3 (note that localhost is 127.0.0.1)
    run the java and python clients simultaneously, sending to the same server
    run the server on a different host (eg a virtual host or a neighboring machine)
    invoke the client with a nonexistent hostname
The versatile netcat utility (also sometimes spelled nc) utility enables sending and receiving of individual UDP (and TCP) packets; we can use it to substitute for the stalk client, or, with a limitation, the server. (The netcat utility, unlike stalk, supports bidirectional communication.)

**Binary Data**

In the stalk example above, the client sent strings to the server. However, what if we are implementing a protocol that requires us to send binary data? Or designing such a protocol? The client and server will now have to agree on how the data is to be encoded.

