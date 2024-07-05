**TCP**

The standard transport protocols riding above the IP layer are TCP and UDP. As we saw in 16   UDP Transport, UDP provides simple datagram delivery to remote sockets, that is, to ⟨host,port⟩ pairs. TCP provides a much richer functionality for sending data to (connected) sockets. In this chapter we cover the basic TCP protocol; in the following chapter we cover some subtle issues related to potential data loss, some TCP implementation details, and then some protocols that serve as alternatives to TCP.

TCP is quite different in several dimensions from UDP. TCP is stream-oriented, meaning that the application can write data in very small or very large amounts and the TCP layer will take care of appropriate packetization (and also that TCP transmits a stream of bytes, not messages or records; cf 18.15.2   SCTP). TCP is connection-oriented, meaning that a connection must be established before the beginning of any data transfer. TCP is reliable, in that TCP uses sequence numbers to ensure the correct order of delivery and a timeout/retransmission mechanism to make sure no data is lost short of massive network failure. Finally, TCP automatically uses the sliding windows algorithm to achieve throughput relatively close to the maximum available.

These features mean that TCP is very well suited for the transfer of large files. The two endpoints open a connection, the file data is written by one end into the connection and read by the other end, and the features above ensure that the file will be received correctly. TCP also works quite well for interactive applications where each side is sending and receiving streams of small packets. Examples of this include ssh or telnet, where packets are exchanged on each keystroke, and database connections that may carry many queries per second. TCP even works reasonably well for request/reply protocols, where one side sends a single message, the other side responds, and the connection is closed. The drawback here, however, is the overhead of setting up a new connection for each request; a better application-protocol design might be to allow multiple request/reply pairs over a single TCP connection.

The connection-oriented nature of TCP warrants further explanation. With UDP, if a server opens a socket (the OS object, with corresponding socket address), then any client on the Internet can send to that socket, via its socket address. Any UDP application, therefore, must be prepared to check the source address of each packet that arrives. With TCP, all data arriving at a connected socket must come from the other endpoint of the connection. When a server S initially opens a socket s, that socket is “unconnected”; it is said to be in the LISTEN state. While it still has a socket address consisting of its host and port, a LISTENing socket will never receive data directly. If a client C somewhere on the Internet wishes to send data to s, it must first establish a connection, which will be defined by the socketpair consisting of the socket addresses at both C and S. As part of this connection process, a new connected child socket sC will be created; it is sC that will receive any data sent from C. Usually, S will also create a new thread or process to handle communication with sC. Typically the server S will have multiple connected children of s, and, for each one, a process attached to it.

f C1 and C2 both connect to s, two connected sockets at S will be created, s1 and s2, and likely two separate processes. When a packet arrives at S addressed to the socket address of s, the source socket address will also be examined to determine whether the data is part of the C1–S or the C2–S connection, and thus whether a read on s1 or on s2, respectively, will see the data.

If S is acting as an ssh server, the LISTENing socket listens on port 22, and the connected child sockets correspond to the separate user login connections; the process on each child socket represents the login process of that user, and may run for hours or days.

The End-to-End Principle is spelled out in [SRC84]; it states in effect that transport issues are the responsibility of the endpoints in question and thus should not be delegated to the core network. This idea has been very influential in TCP design.

Two issues falling under this category are data corruption and congestion. For the first, even though essentially all links on the Internet have link-layer checksums to protect against data corruption, TCP still adds its own checksum (in part because of a history of data errors introduced within routers). For the latter, TCP is today essentially the only layer that addresses congestion management.

Saltzer, Reed and Clark categorized functions that were subject to the End-to-End principle this way:

    The function in question can completely and correctly be implemented only with the knowledge and help of the application standing at the end points of the communication system. Therefore, providing that questioned function as a feature of the communication system itself is not possible. (Sometimes an incomplete version of the function provided by the communication system may be useful as a performance enhancement.)

This does not mean that the backbone Internet should not concern itself with congestion; it means that backbone congestion-management mechanisms should not completely replace end-to-end congestion management.

**TCP Header**

Below is a diagram of the TCP header. As with UDP, source and destination ports are 16 bits. The checksum prevents delivery of corrupted data. The Data Offset is for specifying the number of words of Options.

The sequence and acknowledgment numbers are for numbering the data, at the byte level. This allows TCP to send 1024-byte blocks of data, incrementing the sequence number by 1024 between successive packets, or to send 1-byte telnet packets, incrementing the sequence number by 1 each time. There is no distinction between DATA and ACK packets; all packets carrying data from A to B also carry the most current acknowledgment of data sent from B to A. Many TCP applications are largely unidirectional, in which case the sender would include essentially the same acknowledgment number in each packet while the receiver would include essentially the same sequence number.

It is traditional to refer to the data portion of TCP packets as segments.

TCP acknowledgments are cumulative: when an endpoint sends a packet with an acknowledgment number of N, it is acknowledging receipt of all data bytes numbered less than N. Standard TCP provides no mechanism for acknowledging receipt of packets 1, 2, 3 and 5; the highest cumulative acknowledgment that could be sent in that situation would be to acknowledge packet 3.

The TCP header defines six important flag bits; the brief definitions here are expanded upon in the sequel:

    SYN: for SYNchronize; marks packets that are part of the new-connection handshake
    ACK: indicates that the header Acknowledgment field is valid; that is, all but the first packet
    FIN: for FINish; marks packets involved in the connection closing
    PSH: for PuSH; marks “non-full” packets that should be delivered promptly at the far end
    RST: for ReSeT; indicates various error conditions
    URG: for URGent; part of a now-seldom-used mechanism for high-priority data
    CWR and ECE: part of the Explicit Congestion Notification mechanism




    TCP Connection Establishment

    Connection is established via three-way handshake. If A is the client and B is the LISTENing server, then the handshake proceeds as follows:

    * A sends B a packet with the SYN bit set (a SYN packet)
    * B responds with a SYN packet of its own; the ACK bit is now also set
    * A responds to B’s SYN with its own ACK


Normally, the three-way handshake is triggered by an application’s request to connect; data can be sent only after the handshake completes. This means a one-RTT delay before any data can be sent. The original TCP standard RFC 793 does allow data to be sent with the first SYN packet, as part of the handshake, but such data cannot be released to the remote-endpoint application until the handshake completes. Most traditional TCP programming interfaces offer no support for this early-data option.

To close the connection, a superficially similar exchange involving FIN packets may occur:

    A sends B a packet with the FIN bit set (a FIN packet), announcing that it has finished sending data
    B sends A an ACK of the FIN
    When B is also ready to cease sending, it sends its own FIN to A
    A sends B an ACK of the FIN; this is the final packet in the exchange

    The FIN handshake is really more like two separate two-way FIN/ACK handshakes

    Here is a Java version of the simplex-talk server for TCP. The main while loop has the call ss.accept() at the start; ss is the ServerSocket object and is in LISTEN state. This call blocks until an incoming connection is established, at which point it returns the connected child socket. Connections will be accepted from all IP addresses of the server host, eg the “normal” IP address and also the loopback address 127.0.0.1. Unlike the UDP case (11.1.1.2   UDP and IP addresses), the server response packets will always be sent from the same server IP address that the client first used to reach the server.

A server application can process these connected children either serially or in parallel. The stalk version here can handle both situations, either one connection at a time (THREADING = false), or by creating a new thread for each connection (THREADING = true). In the former mode, if a second client connection is made while the first is connected, then data can be sent on the second connection but it sits in limbo until the first connection closes, at which point control returns to the ss.accept() call, the second connection is processed, and the second connection’s data suddenly appears. The main loop is within the line_talker() call, and does not return to ss.accept() until the connection has closed

What Does Initial Sequence Numbers Mean?

Initial sequence numbers (ISN) refers to the unique 32-bit sequence number assigned to each new connection on a Transmission Control Protocol (TCP)-based data communication. It helps with the allocation of a sequence number that does not conflict with other data bytes transmitted over a TCP connection. An ISN is unique to each connection and separated by each device.

As stated earlier in 12.3   TCP Connection Establishment, both sides choose an ISN; actual sequence numbers are the sum of the sender’s ISN and the relative sequence number. There are two original reasons for this mechanism, and one later one (12.9.1   ISNs and spoofing). The original TCP specification, as clarified in RFC 1122, called for the ISN to be determined by a special clock, incremented by 1 every 4 microseconds.

The most basic reason for using ISNs is to detect duplicate SYNs. Suppose A initiates a connection to B by sending a SYN packet. B replies with SYN+ACK, but this is lost. A then times out and retransmits its SYN. B now receives A’s second SYN while in state SYN_RECEIVED. Does this represent an entirely new request (perhaps A has suddenly restarted), or is it a duplicate? If A uses the clock-driven ISN strategy, B can tell (almost certainly) whether A’s second SYN is new or a duplicate: only in the latter case will the ISN values in the two SYNs match.

While there is no danger to data integrity if A sends a SYN, restarts, and sends the SYN again as part of a reopening the same connection, the arrival of a second SYN with a new ISN means that the original connection cannot proceed, because that ISN is now wrong.

The clock-driven ISN also originally added a second layer of protection against external old duplicates. Suppose that A opens a connection to B, and chooses a clock-based ISN N1. A then transfers M bytes of data, closed the connection, and reopens it with ISN N2. If N1 + M < N2, then the old-duplicates problem cannot occur: all of the absolute sequence numbers used in the first instance of the connection are less than or equal to N1 + M, and all of the absolute sequence numbers used in the second instance will be greater than N2. In fact, early Berkeley-Unix implementations of the socket library often allowed a second connection meeting this ISN requirement to be reopened before TIMEWAIT would have expired; this potentially addressed the problem of port exhaustion. Of course, if the first instance of the connection transferred data faster than the ISN clock rate, that is at more than 250,000 bytes/sec, then N1 + M would be greater than N2, and TIMEWAIT would have to be enforced. But in the era in which TCP was first developed, sustained transfers exceeding 250,000 bytes/sec were not common.

The reader who is implementing TCP is encouraged to consult RFC 793 and updates. For the rest of us, below are a few general observations about opening and closing connections.

Either side may elect to close the connection (just as either party to a telephone call may elect to hang up). The first side to send a FIN takes the Active CLOSE path; the other side takes the Passive CLOSE path.

Although it essentially never occurs in practice, it is possible for each side to send the other a SYN, requesting a connection, simultaneously (that is, the SYNs cross on the wire). The telephony analogue occurs when each party dials the other simultaneously. On traditional land-lines, each party then gets a busy signal. On cell phones, your mileage may vary. With TCP, a single connection is created. With OSI TP4, two connections are created. The OSI approach is not possible in TCP, as a connection is determined only by the socketpair involved; if there is only one socketpair then there can be only one connection.

A simultaneous close – having both sides simultaneously send each other FINs – is a little more likely, though still not very. Each side would move to state FIN_WAIT_1. Then, upon receiving each other’s FIN packets, each side would move to CLOSING, and then to TIMEWAIT.

A TCP endpoint is half-closed if it has sent its FIN (thus promising not to send any more data) and is waiting for the other side’s FIN. A TCP endpoint is half-open if it is in the ESTABLISHED state, but in the meantime the other side has rebooted. As soon as the ESTABLISHED side sends a packet, the other side will respond with RST and the connection will be fully closed.

Conceptually, perhaps the most serious threat facing the integrity of TCP data is external old duplicates (11.2   Fundamental Transport Issues), that is, very late packets from a previous instance of the connection. Suppose a TCP connection is opened between A and B. One packet from A to B is duplicated and unduly delayed, with sequence number N. The connection is closed, and then another instance is reopened, that is, a connection is created using the same ports. At some point in the second connection, when an arriving packet with seq=N would be acceptable at B, the old duplicate shows up. Later, of course, B is likely to receive a seq=N packet from the new instance of the connection, but that packet will be seen by B as a duplicate (even though the data does not match), and (we will assume) ignored.

The TIMEWAIT state is entered by whichever side initiates the connection close; in the event of a simultaneous close, both sides enter TIMEWAIT. It is to last for a time 2×MSL, where MSL = Maximum Segment Lifetime is an agreed-upon value for the maximum lifetime on the Internet of an IP packet. Traditionally MSL was taken to be 60 seconds, but more modern implementations often assume 30 seconds (for a TIMEWAIT period of 60 seconds).

One function of TIMEWAIT is to solve the external-old-duplicates problem. TIMEWAIT requires that between closing and reopening a connection, a long enough interval must pass that any packets from the first instance will disappear. After the expiration of the TIMEWAIT interval, an old duplicate cannot arrive.

As stated earlier in 12.3   TCP Connection Establishment, both sides choose an ISN; actual sequence numbers are the sum of the sender’s ISN and the relative sequence number. There are two original reasons for this mechanism, and one later one (12.9.1   ISNs and spoofing). The original TCP specification, as clarified in RFC 1122, called for the ISN to be determined by a special clock, incremented by 1 every 4 microseconds.

The most basic reason for using ISNs is to detect duplicate SYNs. Suppose A initiates a connection to B by sending a SYN packet. B replies with SYN+ACK, but this is lost. A then times out and retransmits its SYN. B now receives A’s second SYN while in state SYN_RECEIVED. Does this represent an entirely new request (perhaps A has suddenly restarted), or is it a duplicate? If A uses the clock-driven ISN strategy, B can tell (almost certainly) whether A’s second SYN is new or a duplicate: only in the latter case will the ISN values in the two SYNs match.

While there is no danger to data integrity if A sends a SYN, restarts, and sends the SYN again as part of a reopening the same connection, the arrival of a second SYN with a new ISN means that the original connection cannot proceed, because that ISN is now wrong.

The clock-driven ISN also originally added a second layer of protection against external old duplicates. Suppose that A opens a connection to B, and chooses a clock-based ISN N1. A then transfers M bytes of data, closed the connection, and reopens it with ISN N2. If N1 + M < N2, then the old-duplicates problem cannot occur: all of the absolute sequence numbers used in the first instance of the connection are less than or equal to N1 + M, and all of the absolute sequence numbers used in the second instance will be greater than N2. In fact, early Berkeley-Unix implementations of the socket library often allowed a second connection meeting this ISN requirement to be reopened before TIMEWAIT would have expired; this potentially addressed the problem of port exhaustion. Of course, if the first instance of the connection transferred data faster than the ISN clock rate, that is at more than 250,000 bytes/sec, then N1 + M would be greater than N2, and TIMEWAIT would have to be enforced. But in the era in which TCP was first developed, sustained transfers exceeding 250,000 bytes/sec were not common.

The clock-based ISN proved to have a significant weakness: it often allowed an attacker to guess the ISN a remote host might use. It did not help any that an early version of Berkeley Unix, instead of incrementing the ISN 250,000 times a second, incremented it once a second, by 250,000 (plus something for each connection). By guessing the ISN a remote host would choose, an attacker might be able to mimic a local, trusted host, and thus gain privileged access.

Specifically, suppose host A trusts its neighbor B, and executes with privileged status commands sent by B; this situation was typical in the era of the rhost command. A authenticates these commands because the connection comes from B’s IP address. The bad guy, M, wants to send packets to A so as to pretend to be B, and thus get a privileged command invoked. The connection only needs to be started; if the ruse is discovered after the command is executed, it is too late. M can easily send a SYN packet to A with B’s IP address in the source-IP field; M can probably temporarily disable B too, so that A’s SYN-ACK response, which is sent to B, goes unnoticed. What is harder is for M to figure out how to guess how to ACK ISNA. But if A generates ISNs with a slowly incrementing clock, M can guess the pattern of the clock with previous connection attempts, and can thus guess ISNA with a considerable degree of accuracy. So M sends SYN to A with B as source, A sends SYN-ACK to B containing ISNA, and M guesses this value and sends ACK(ISNA+1) to A, again with B listed in the IP header as source, followed by a single-packet command.

This “IP-spoofing” technique was first described by Robert T Morris in [RTM85]; Morris went on to launch the Internet Worm of 1988 using unrelated attacks. The IP-spoofing technique was used in the 1994 Christmas Day attack against UCSD, launched from Loyola’s own apollo.it.luc.edu; the attack was associated with Kevin Mitnick though apparently not actually carried out by him. Mitnick was arrested a few months later.



RFC 1948, in May 1996, introduced a technique for introducing a degree of randomization in ISN selection, while still ensuring that the same ISN would not be used twice in a row for the same connection. The ISN is to be the sum of the 4-µs clock, C(t), and a secure hash of the connection information as follows:

    ISN = C(t) + hash(local_addr, local_port, remote_addr, remote_port, key)

The key value is a random value chosen by the host on startup. While M, above, can poll A for its current ISN, and can probably guess the hash function and the first four parameters above, without knowing the key it cannot determine (or easily guess) the ISN value A would have sent to B. Legitimate connections between A and B, on the other hand, see the ISN increasing at the 4-µs rate.

TCP connections are more efficient if they can keep large packets flowing between the endpoints. Once upon a time, TCP endpoints included just 512 bytes of data in each packet that was not destined for local delivery, to avoid fragmentation. TCP endpoints now typically engage in Path MTU Discovery which almost always allows them to send larger packets; backbone ISPs are now usually able to carry 1500-byte packets. The Path MTU is the largest packet size that can be sent along a path without fragmentation.

The strategy is to send an initial data packet with the IP DONT_FRAG bit set. If the ICMP message Frag_Required/DONT_FRAG_Set comes back, or if the packet times out, the sender tries a smaller size. If the sender receives a TCP ACK for the packet, on the other hand, indicating that it made it through to the other end, it might try a larger size. Usually, the size range of 512-1500 bytes is covered by less than a dozen discrete values; the point is not to find the exact Path MTU but to determine a reasonable approximation rapidly.

TCP implements sliding windows, in order to improve throughput. Window sizes are measured in terms of bytes rather than packets; this leaves TCP free to packetize the data in whatever segment size it elects. In the initial three-way handshake, each side specifies the maximum window size it is willing to accept, in the Window Size field of the TCP header. This 16-bit field can only go to 64 KB, and a 1 Gbps × 100 ms bandwidth×delay product is 12 MB; as a result, there is a TCP Window Scale option that can also be negotiated in the opening handshake.

TCP receivers are allowed briefly to delay their ACK responses to new data. This offers perhaps the most benefit for interactive applications that exchange small packets, such as ssh and telnet. If A sends a data packet to B and expects an immediate response, delaying B’s ACK allows the receiving application on B time to wake up and generate that application-level response, which can then be sent together with B’s ACK. Without delayed ACKs, the kernel layer on B may send its ACK before the receiving application on B has even been scheduled to run. If response packets are small, that doubles the total traffic. The maximum ACK delay is 500 ms, according to RFC 1122 and RFC 2581.

For bulk traffic, delayed ACKs simply mean that the ACK traffic volume is reduced. Because ACKs are cumulative, one ACK from the receiver can in principle acknowledge multiple data packets from the sender. Unfortunately, acknowledging too many data packets with one ACK can interfere with the self-clocking aspect of sliding windows; the arrival of that ACK will then trigger a burst of additional data packets, which would otherwise have been transmitted at regular intervals. Because of this, the RFCs above specify that an ACK be sent, at a minimum, for every other data packet.

A TCP receiver may reduce th
e Window Size value of an open connection, thus informing the sender to switch to a smaller window size. This has nothing to do with congestion management but is instead related to flow control. This reduction appears in the ACKs sent back by the receiver. A given ACK is not supposed to reduce the window size by more than the size of the data it is acknowledging; in other words, the upper end of the window, lastACKed+winsize, is never supposed to get smaller. This means that no data sent by the sender will ever be retroactively invalidated by becoming beyond the upper edge of the window. A window might shrink from [20,000..28,000] to [22,000..28,000] but never to [20,000..26,000].

For TCP to work well for both intra-server-room and trans-global connections, the timeout value must adapt. TCP manages this by maintaining a running estimate of the RTT, EstRTT. In the original version, TCP then set TimeOut = 2×EstRTT (in the literature, the TCP TimeOut value is often known as RTO, for Retransmission TimeOut). EstRTT itself was a running average of periodically measured SampleRTT values, according 

There is no reason that a TCP connection should not be idle for a long period of time; ssh/telnet connections, for example, might go unused for days. However, there is the turned-off-at-night problem: a workstation might telnet into a server, and then be shut off (not shut down gracefully) at the end of the day. The connection would now be half-open, but the server would not generate any traffic and so might never detect this; the connection itself would continue to tie up resources.