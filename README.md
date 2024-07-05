# **Chapter 20 - Networking Basics**


## **Objectives**

* **Understanding the basic layer model of networking** 

* **Describe and Implement Web, TCP and UDP sockets, explain each of their use cases, details the pros and cons of their respective uses and explain managing errors and security concerns**




### **Introduction**


<span style="font-size:1.2em;">Local Area Networks (LANs) are the physical networks that provide the connection between machines within for example a home or school. LANs are local, then IP (internet protocol) layer that provides an abstraction for connecting multiple LANS to the internet. Finally TCP addresses connections and the transport of user data.</span>

These three topics – LANs, IP and TCP – are often called layers; they constitute the Link layer, the Internetwork layer, and the Transport layer respectively. Together with the Application layer (the software you use), these form the “four-layer model” for networks. A layer, in this context, corresponds strongly to the idea of a programming interface or library, with the understanding that a given layer communicates directly only with the two layers immediately above and below it. An application hands off a chunk of data to the TCP library, which in turn makes calls to the IP library, which in turn calls the LAN layer for actual delivery. An application does not interact directly with the IP and LAN layers at all.


**<ins>The Physical Layer and Ethernet:</ins>**

The LAN layer is in charge of actual delivery of packets, using LAN-layer-supplied addresses. It is often conceptually subdivided into the “physical layer” dealing with, eg, the analog electrical, optical or radio signaling mechanisms involved, and above that an abstracted “logical” LAN layer that describes all the digital – that is, non-analog – operations on packets; see 2.1.4   The LAN Layer. The physical layer is generally of direct concern only to those designing LAN hardware; the kernel software interface to the LAN corresponds to the logical LAN layer.

Any one network connection – eg at the LAN layer – has a data rate: the rate at which bits are transmitted. In some LANs (eg Wi-Fi) the data rate can vary with time. Throughput refers to the overall effective transmission rate, taking into account things like transmission overhead, protocol inefficiencies and perhaps even competing traffic. It is generally measured at a higher network layer than the data rate.

The term bandwidth can be used to refer to either of these, though we here use it mostly as a synonym for data rate. The term comes from radio transmission, where the width of the frequency band available is proportional, all else being equal, to the data rate that can be achieved.

In discussions about TCP, the term goodput is sometimes used to refer to what might also be called “application-layer throughput”: the amount of usable data delivered to the receiving application. Specifically, retransmitted data is counted only once when calculating goodput but might be counted twice under some interpretations of “throughput”.

Data rates are generally measured in kilobits per second (kbps) or megabits per second (Mbps).






**Packets**: Packets are modest-sized sequences of bytes, transmitted as a unit through some shared set of links. Of necessity, packets need to be prefixed with a header containing delivery information. In the common case known as datagram forwarding, the header contains a destination address; headers in networks using so-called virtual-circuit forwarding contain instead an identifier for the connection. Almost all networking today (and for the past 50 years) is packet-based.

At the LAN layer, packets can be viewed as the imposition of a buffer (and addressing) structure on top of low-level serial lines; additional layers then impose additional structure. Informally, packets are often referred to as frames at the LAN layer, and as segments at the Transport layer.
Generally each layer adds its own header. Ethernet headers are typically 14 bytes, IP headers 20 bytes, and TCP headers 20 bytes. If a TCP connection sends 512 bytes of data per packet, then the headers amount to 10% of the total, a not-unreasonable overhead.

It is perhaps worth noting that packets are buffers built of 8-bit bytes, and all hardware today agrees what a byte is (hardware agrees by convention on the order in which the bits of a byte are to be transmitted). 8-bit bytes are universal now

he early Internet specifications introduced the term octet (an 8-bit byte) and required that packets be sequences of octets; non-octet-oriented hosts had to be able to convert. Thus was chaos averted. Note that there are still byte-oriented data issues; as one example, binary integers can be represented as a sequence of bytes in either big-endian or little-endian byte order (16.1.5   Binary Data). RFC 1700 specifies that Internet protocols use big-endian byte order, therefore sometimes called network byte order.

In the datagram-forwarding model of packet delivery, packet headers contain a destination address. It is up to the intervening switches or routers to look at this address and get the packet to the correct destination.

In datagram forwarding this is achieved by providing each switch with a forwarding table of ⟨destination,next_hop⟩ pairs. When a packet arrives, the switch looks up the destination address (presumed globally unique) in its forwarding table and finds the next_hop information: the immediate-neighbor address to which – or interface by which – the packet should be forwarded in order to bring it one step closer to its final destination. The next_hop value in a forwarding table is a single entry; each switch is responsible for only one step in the packet’s path. However, if all is well, the network of switches will be able to deliver the packet, one hop at a time, to its ultimate destination.

The “destination” entries in the forwarding table do not have to correspond exactly with the packet destination addresses, though in the examples here they do, and they do for Ethernet datagram forwarding. However, for IP routing, the table “destination” entries will correspond to prefixes of IP addresses; this leads to a huge savings in space. The fundamental requirement is that the switch can perform a lookup operation, using its forwarding table and the destination address in the arriving packet, to determine the next hop.

A central feature of datagram forwarding is that each packet is forwarded “in isolation”; the switches involved do not have any awareness of any higher-layer logical connections established between endpoints. This is also called stateless forwarding, in that the forwarding tables have no per-connection state.




We emphasize that the presence of congestion does not mean that a network has a shortage of bandwidth. Bulk-traffic senders (though not real-time senders) attempt to send as fast as possible, and congestion is simply the network’s feedback that the maximum transmission rate has been reached.
Congestion is a sign of a problem in real-time networks, which we will consider in 25   Quality of Service. In these networks losses due to congestion must generally be kept to an absolute minimum; one way to achieve this is to limit the acceptance of new connections unless sufficient resources are available.


When should you upgrade your network? Deciding when a network really does have insufficient bandwidth is not a technical issue but an economic one. The number of customers may increase, the cost of bandwidth may decrease or customers may simply be willing to pay more to have data transfers complete in less time; “customers” here can be external or in-house. Monitoring of links and routers for congestion can, however, help determine exactly what parts of the network would most benefit from upgrade. 

Perhaps the core justification for packets, Baran’s concerns about node failure notwithstanding, is that the same link can carry, at different times, different packets representing traffic to different destinations and from different senders. Thus, packets are the key to supporting shared transmission lines; that is, they support the multiplexing of multiple communications channels over a single cable. The alternative of a separate physical line between every pair of machines grows prohibitively complex very quickly.

From this shared-medium perspective, an important packet feature is the maximum packet size, as this represents the maximum time a sender can send before other senders get a chance. The alternative of unbounded packet sizes would lead to prolonged network unavailability for everyone else if someone downloaded a large file in a single 1 Gigabit packet. Another drawback to large packets is that, if the packet is corrupted, the entire packet must be retransmitted; see 7.3.1   Error Rates and Packet Size.

When a router or switch receives a packet, it (generally) reads in the entire packet before looking at the header to decide to what next node to forward it. This is known as store-and-forward, and introduces a forwarding delay equal to the time needed to read in the entire packet. For individual packets this forwarding delay is hard to avoid (though some higher-end switches do implement cut-through switching to begin forwarding a packet before it has fully arrived), but if one is sending a long train of packets then by keeping multiple packets en route at the same time one can essentially eliminate the significance of the forwarding delay;

Total packet delay from sender to receiver is the sum of the following:

    Bandwidth delay, ie sending 1000 Bytes at 20 Bytes/millisecond will take 50 ms. This is a per-link delay.
    Propagation delay due to the speed of light. For example, if you start sending a packet right now on a 5000-km cable across the US with a propagation speed of 200 m/µsec (= 200 km/ms, about 2/3 the speed of light in vacuum), the first bit will not arrive at the destination until 25 ms later. The bandwidth delay then determines how much after that the entire packet will take to arrive.
    Store-and-forward delay, equal to the sum of the bandwidth delays out of each router along the path
    Queuing delay, or waiting in line at busy routers. At bad moments this can exceed 1 sec, though that is rare. Generally it is less than 10 ms and often is less than 1 ms. Queuing delay is the only delay component amenable to reduction through careful engineering.

Ethernet addresses are six bytes long. Each Ethernet card (or network interface) is assigned a (supposedly) unique address at the time of manufacture; this address is burned into the card’s ROM and is called the card’s physical address or hardware address or MAC (Media Access Control) address. The first three bytes of the physical address have been assigned to the manufacturer; the subsequent three bytes are a serial number assigned by that manufacturer.

By comparison, IP addresses are assigned administratively by the local site. The basic advantage of having addresses in hardware is that hosts automatically know their own addresses on startup; no manual configuration or server query is necessary. It is not unusual for a site to have a large number of identically configured workstations, for which all network differences derive ultimately from each workstation’s unique Ethernet address.

The network interface continually monitors all arriving packets; if it sees any packet containing a destination address that matches its own physical address, it grabs the packet and forwards it to the attached CPU (via a CPU interrupt).

Ethernet also has a designated broadcast address. A host sending to the broadcast address has its packet received by every other host on the network; if a switch receives a broadcast packet on one port, it forwards the packet out every other port. This broadcast mechanism allows host A to contact host B when A does not yet know B’s physical address; typical broadcast queries have forms such as “Will the designated server please answer” or (from the ARP protocol) “will the host with the given IP address please tell me your physical address”.

Traffic addressed to a particular host – that is, not broadcast – is said to be unicast.

Because Ethernet addresses are assigned by the hardware, knowing an address does not provide any direct indication of where that address is located on the network. In switched Ethernet, the switches must thus have a forwarding-table record for each individual Ethernet address on the network; for extremely large networks this ultimately becomes unwieldy. Consider the analogous situation with postal addresses: Ethernet is somewhat like attempting to deliver mail using social-security numbers as addresses, where each postal worker is provided with a large catalog listing each person’s SSN together with their physical location. Real postal mail is, of course, addressed “hierarchically” using ever-more-precise specifiers: state, city, zipcode, street address, and name / room#. Ethernet, in other words, does not scale well to “large” sizes.



**Internet Protocol**



To solve the scaling problem with Ethernet, and to allow support for other types of LANs and point-to-point links as well, the Internet Protocol was developed. Perhaps the central issue in the design of IP was to support universal connectivity (everyone can connect to everyone else) in such a way as to allow scaling to enormous size (in 2013 there appear to be around ~109 nodes, although IP should work to 1010 nodes or more), without resulting in unmanageably large forwarding tables (currently the largest tables have about 300,000 entries.)

In the early days, IP networks were considered to be “internetworks” of basic networks (LANs); nowadays users generally ignore LANs and think of the Internet as one large (virtual) network.

To support universal connectivity, IP provides a global mechanism for addressing and routing, so that packets can actually be delivered from any host to any other host. IP addresses (for the most-common version 4, which we denote IPv4) are 4 bytes (32 bits), and are part of the IP header that generally follows the Ethernet header. The Ethernet header only stays with a packet for one hop; the IP header stays with the packet for its entire journey across the Internet.

An essential feature of IPv4 (and IPv6) addresses is that they can be divided into a network part (a prefix) and a host part (the remainder). The “legacy” mechanism for designating the IPv4 network and host address portions was to make the division according to the first few bits:

IP addresses, unlike Ethernet addresses, are administratively assigned. Once upon a time, you would get your Class B network prefix from the Internet Assigned Numbers Authority, or IANA (they now delegate this task), and then you would in turn assign the host portion in a way that was appropriate for your local site. As a result of this administrative assignment, an IP address usually serves not just as an endpoint identifier but also as a locator, containing embedded location information (at least in the sense of location within the IP-address-assignment hierarchy, which may not be geographical). Ethernet addresses, by comparison, are endpoint identifiers but not locators.


The network portion of an IP address is sometimes called the network number or network address or network prefix. As we shall see below, most forwarding decisions are made using only the network prefix. The network prefix is commonly denoted by setting the host bits to zero and ending the resultant address with a slash followed by the number of network bits in the address: eg 12.0.0.0/8 or 147.126.0.0/16. Note that 12.0.0.0/8 and 12.0.0.0/9 represent different things; in the latter, the second byte of any host address extending the network address is constrained to begin with a 0-bit. An anonymous block of IP addresses might be referred to only by the slash and following digit, eg “we need a /22 block to accommodate all our customers”.

All hosts with the same network address (same network bits) are said to be on the same IP network and must be located together on the same LAN; as we shall see below, if two hosts share the same network address then they will assume they can reach each other directly via the underlying LAN, and if they cannot then connectivity fails. A consequence of this rule is that outside of the site only the network bits need to be looked at to route a packet to the site.

Usually, all hosts (or more precisely all network interfaces) on the same physical LAN share the same network prefix and thus are part of the same IP network. Occasionally, however, one LAN is divided into multiple IP networks.

ach individual LAN technology has a maximum packet size it supports; for example, Ethernet has a maximum packet size of about 1500 bytes but the once-competing Token Ring had a maximum of 4 kB. Today the world has largely standardized on Ethernet and almost entirely standardized on Ethernet packet-size limits, but this was not the case when IP was introduced and there was real concern that two hosts on separate large-packet networks might try to exchange packets too large for some small-packet intermediate network to carry.

Therefore, in addition to routing and addressing, the decision was made that IP must also support fragmentation: the division of large packets into multiple smaller ones (in other contexts this may also be called segmentation). The IP approach is not very efficient, and IP hosts go to considerable lengths to avoid fragmentation. IP does require that packets of up to 576 bytes be supported, and so a common legacy strategy was for a host to limit a packet to at most 512 user-data bytes whenever the packet was to be sent via a router; packets addressed to another host on the same LAN could of course use a larger packet size. Despite its limited use, however, fragmentation is essential conceptually, in order for IP to be able to support large packets without knowing anything about the intervening networks.


IP is a best effort system; there are no IP-layer acknowledgments or retransmissions. We ship the packet off, and hope it gets there. Most of the time, it does.

Architecturally, this best-effort model represents what is known as connectionless networking: the IP layer does not maintain information about endpoint-to-endpoint connections, and simply forwards packets like a giant LAN. Responsibility for creating and maintaining connections is left for the next layer up, the TCP layer. Connectionless networking is not the only way to do things: the alternative could have been some form connection-oriented internetworking, in which routers do maintain state information about individual connections. 


Connectionless (IP-style) and connection-oriented networking each have advantages. Connectionless networking is conceptually more reliable: if routers do not hold connection state, then they cannot lose connection state. The path taken by the packets in some higher-level connection can easily be dynamically rerouted. Finally, connectionless networking makes it hard for providers to bill by the connection; once upon a time (in the era of dollar-a-minute phone calls) this was a source of mild astonishment to many new users.

The most common form of IP packet loss is router queue overflows, representing network congestion. Packet losses due to packet corruption are rare (eg less than one in 104; perhaps much less). But in a connectionless world a large number of hosts can simultaneously attempt to send traffic through one router, in which case queue overflows are hard to avoid.

**IP Forwarding**

IP routers use datagram forwarding, described in 1.4   Datagram Forwarding above, to deliver packets, but the “destination” values listed in the forwarding tables are network prefixes – representing entire LANs – instead of individual hosts. The goal of IP forwarding, then, becomes delivery to the correct LAN; a separate process is used to deliver to the final host once the final LAN has been reached.

The entire point, in fact, of having a network/host division within IP addresses is so that routers need to list only the network prefixes of the destination addresses in their IP forwarding tables. This strategy is the key to IP scalability: it saves large amounts of forwarding-table space, it saves time as smaller tables allow faster lookup, and it saves the bandwidth and overhead that would be needed for routers to keep track of individual addresses. To get an idea of the forwarding-table space savings, there are currently (2013) around a billion hosts on the Internet, but only 300,000 or so networks listed in top-level forwarding tables.

We will refer to the Internet backbone as those IP routers that specialize in large-scale routing on the commercial Internet, and which generally have forwarding-table entries covering all public IP addresses.

The backbone is not as essential as it once was. Once Upon A Time, all traffic between different providers passed through the backbone. The legacy backbone still exists, but today it is also common for traffic from large providers such as Google to take a backbone-free path; such providers connect (or “peer”) directly with large residential ISPs such as Comcast. Google refers to this as their “Edge Network”; see 


As of the end of January 2011, the IANA finally ran out of /8 blocks. There is a table at http://www.iana.org/assignments/ipv4-address-space/ipv4-address-space.xml of all IANA assignments of /8 blocks; examination of the table shows all have now been allocated.

In September 2015, ARIN ran out of its pool of IPv4 addresses. Most of ARIN’s customers are ISPs, which can now obtain new IPv4 addresses only by buying unused address blocks from other organizations.

A few months after the IANA pool ran out in 2011, Microsoft purchased 666,624 IP addresses (2604 Class-C blocks) in a Nortel bankruptcy auction for $7.5 million. Three years later, IP-address prices fell to half that, but, by 2019, had climbed to the $20-and-up range. In that year Amazon bought a 4-million-address block (44.0.0.0/10) for $108 million, or $27/address. Prices remained in the $20 range through 2020, but by the end of 2021 had climbed to $50-$55, with several /19 blocks sold in January 2022 in that range. The market for IPv4 address blocks continues to develop, but the only real solution is widespread adoption of IPv6 with its plentiful 128-bit addresses.

**DNS**

IP addresses are hard to remember (nearly impossible in IPv6). The domain name system, or DNS (10.1   DNS), comes to the rescue by creating a way to convert hierarchical text names to IP addresses. Thus, for example, one can type www.luc.edu instead of 147.126.1.230. Virtually all Internet software uses the same basic library calls to convert DNS names to actual addresses.

One thing DNS makes possible is changing a website’s IP address while leaving the name alone. This allows moving a site to a new provider, for example, without requiring users to learn anything new. It is also possible to have several different DNS names resolve to the same IP address, and – through some modest trickery – have the http (web) server at that IP address handle the different DNS names as completely different websites.

DNS is hierarchical and distributed. In looking up cs.luc.edu four different DNS servers may be queried: for the so-called “DNS root zone”, for edu, for luc.edu and for cs.luc.edu. Searching a hierarchy can be cumbersome, so DNS search results are normally cached locally. If a name is not found in the cache, the lookup may take a couple seconds. The DNS hierarchy need have nothing to do with the IP-address hierarchy.




**Transport**

The IP layer gets packets from one node to another, but it is not well-suited to transport. First, IP routing is a “best-effort” mechanism, which means packets can and do get lost sometimes. Additionally, data that does arrive can arrive out of order. Finally, IP only supports sending to a specific host; normally, one wants to send to a given application running on that host. Email and web traffic, or two different web sessions, should not be commingled!

**The Transport layer is the layer above the IP layer that handles these sorts of issues, often by creating some sort of connection abstraction. Far and away the most popular mechanism in the Transport layer is the Transmission Control Protocol, or TCP. TCP extends IP with the following features:**



    * reliability: TCP numbers each packet, and keeps track of which are lost and retransmits them after a timeout. It holds early-arriving out-of-order packets for delivery at the correct time. Every arriving data packet is acknowledged by the receiver; timeout and retransmission occurs when an acknowledgment packet isn’t received by the sender within a given time.

    * connection-orientation: Once a TCP connection is made, an application sends data simply by writing to that connection. No further application-level addressing is needed. TCP connections are managed by the operating-system kernel, not by the application.

    * stream-orientation: An application using TCP can write 1 byte at a time, or 100 kB at a time; TCP will buffer and/or divide up the data into appropriate sized packets.

    * port numbers: these provide a way to specify the receiving application for the data, and also to identify the sending application.
    throughput management: TCP attempts to maximize throughput, while at the same time not contributing unnecessarily to network congestion.

**TCP endpoints are of the form ⟨host,port⟩; these pairs are known as socket addresses, or sometimes as just sockets though the latter refers more properly to the operating-system objects that receive the data sent to the socket addresses.** Servers (or, more precisely, server applications) listen for connections to sockets they have opened; the client is then any endpoint that initiates a connection to a server.

When you enter a host name in a web browser, it opens a TCP connection to the server’s port 80 (the standard web-traffic port), that is, to the server socket with socket-address ⟨server,80⟩. If you have several browser tabs open, each might connect to the same server socket, but the connections are distinguishable by virtue of using separate ports (and thus having separate socket addresses) on the client end (that is, your end).

**A busy server may have thousands of connections to its port 80 (the web port) and hundreds of connections to port 25 (the email port). Web and email traffic are kept separate by virtue of the different ports used. All those clients to the same port, though, are kept separate because each comes from a unique ⟨host,port⟩ pair. A TCP connection is determined by the ⟨host,port⟩ socket address at each end; traffic on different connections does not intermingle. That is, there may be multiple independent connections to ⟨www.luc.edu,80⟩.**

* The window size represents the number of packets simultaneously in transit (TCP actually keeps track of the window size in bytes, but packets are easier to visualize). If the window size is 10 packets, for example, then at any one time 10 packets are in transit Assuming no packets are lost, then as each acknowledgment arrives the window “slides forward” by one packet. The data packet 10 packets ahead is then sent, to maintain a total of 10 packets on the wire. For example, consider the moment when the ten packets 20-29 are in transit. When ACK[20] is received, the number of packets outstanding drops to 9 (packets 21-29). To keep 10 packets in flight, Data[30] is sent. When ACK[21] is received, Data[31] is sent, and so on.


While TCP is ubiquitous, the real-time performance of TCP is not always consistent: if a packet is lost, the receiving TCP host will not turn over anything further to the receiving application until the lost packet has been retransmitted successfully; this is often called head-of-line blocking. This is a serious problem for sound and video applications, which can discreetly handle modest losses but which have much more difficulty with sudden large delays. A few lost packets ideally should mean just a few brief voice dropouts (pretty common on cell phones) or flicker/snow on the video screen (or just reuse of the previous frame); both of these are better than pausing completely.

The basic alternative to TCP is known as UDP, for User Datagram Protocol. UDP, like TCP, provides port numbers to support delivery to multiple endpoints within the receiving host, in effect to a specific process on the host. As with TCP, a UDP socket consists of a ⟨host,port⟩ pair. UDP also includes, like TCP, a checksum over the data. However, UDP omits the other TCP features: there is no connection setup, no lost-packet detection, no automatic timeout/retransmission, and the application must manage its own packetization. This simplicity should not be seen as all negative: the absence of connection setup means data transmission can get started faster, and the absence of lost-packet detection means there is no head-of-line blocking.

The two “classic” traffic patterns for Internet communication are these:

    Interactive or bursty communications such as via ssh or telnet, with long idle times between short bursts
    Bulk file transfers, such as downloading a web page

TCP handles both of these well, although its congestion-management features apply only when a large amount of data is in transit at once. Web browsing is something of a hybrid; over time, there is usually considerable burstiness, but individual pages now often exceed 1 MB.

This century has seen an explosion in streaming video (25.3.2   Streaming Video), in lengths from a few minutes to a few hours. Streaming radio stations might be left playing indefinitely. TCP generally works well here, assuming the receiver can get, say, a minute ahead, buffering the video that has been received but not yet viewed. That way, if there is a dip in throughput due to congestion, the receiver has time to recover. Buffering works a little less well for streaming radio, as the listener doesn’t want to get too far behind, though ten seconds is reasonable. Fortunately, audio bandwidth is smaller.

Another issue with streaming video is the bandwidth demand. Most streaming-video services attempt to estimate the available throughput, and then adapt to that throughput by changing the video resolution (25.3   Real-time Traffic).

Typically, video streaming operates on a start/stop basis: the sender pauses when the receiver’s playback buffer is “full”, and resumes when the playback buffer drops below a certain threshold.

If the video (or, for that matter, voice audio) is interactive, there is much less opportunity for stream buffering. If someone asks a simple question on an Internet telephone call, they generally want an answer more or less immediately; they do not expect to wait for the answer to make it through the other party’s stream buffer. 200 ms of buffering is noticeable. Here we enter the realm of genuine real-time traffic (25.3   Real-time Traffic). UDP is often used to avoid head-of-line blocking. Lower bandwidth helps; voice-grade communications traditionally need only 8 kB/sec, less if compression is used. On the other hand, there may be constraints on the variation in delivery time (known as jitter; see 25.11.3   RTP Control Protocol for a specific numeric interpretation). Interactive video, with its much higher bandwidth requirements, is more difficult; fortunately, users seem to tolerate the common pauses and freezes.

Within the Transport layer, essentially all network connections involve a client and a server. Often this pattern is repeated at the Application layer as well: the client contacts the server and initiates a login session, or browses some web pages, or watches a movie. Sometimes, however, Application-layer exchanges fit the peer-to-peer model better, in which the two endpoints are more-or-less co-equals. Some examples include

    Internet telephony: there is no benefit in designating the party who place the call as the “client”
    Message passing in a CPU cluster, often using 16.5   Remote Procedure Call (RPC)
    The routing-communication protocols of 13   Routing-Update Algorithms. When router A reports to router B we might call A the client, but over time, as A and B report to one another repeatedly, the peer-to-peer model makes more sense.
    So-called peer-to-peer file-sharing, where individuals exchange files with other individuals (and as opposed to “cloud-based” file-sharing in which the “cloud” is the server).



**Content Distribution Networks**

Sites with an extremely large volume of content to distribute often turn to a specialized communication pattern called a content-distribution network or CDN. To reduce the amount of long-distance traffic, or to reduce the round-trip time, a site replicates its content at multiple datacenters (also called Points of Presence (PoPs), nodes, access points or edge servers). When a user makes a request (eg for a web page or a video), the request is routed to the nearest (or approximately nearest) datacenter, and the content is delivered from there.

Large web pages typically contain both static content and also individualized dynamic content. On a typical Facebook page, for example, the videos and javascript might be considered static, while the individual wall posts might be considered dynamic. The CDN may cache all or most of the static content at each of its edge servers, leaving the dynamic content to come from a centralized server. Alternatively, the dynamic content may be replicated at each CDN edge node as well, though this introduces some real-time coordination issues.

If dynamic content is not replicated, the CDN may include private high-speed links between its nodes, allowing for rapid low-congestion delivery to any node. Alternatively, CDN nodes may simply communicate using the public Internet. Finally, the CDN may (or may not) be configured to support fast interactive traffic between nodes, eg teleconferencing traffic, as is outlined in 25.6.1   A CDN Alternative to IntServ.

Organizations can create their own CDNs, but often turn to specialized CDN providers, who often combine their CDN services with website-hosting services.Finding the edge server that is closest to a given user is a tricky issue. There are three techniques in common use. In the first, the edge servers are all given different IP addresses, and DNS is configured to have users receive the IP address of the closest edge server, 10.1   DNS. In the second, each edge server has the same IP address, and anycast routing is used to route traffic from the user to the closest edge server, 15.8   BGP and Anycast. Finally, for HTTP applications a centralized server can look up the approximate location of the user, and then redirect the web page to the closest edge server.

**Firewall**

One problem with having a program on your machine listening on an open TCP port is that someone may connect and then, using some flaw in the software on your end, do something malicious to your machine. Damage can range from the unintended downloading of personal data to compromise and takeover of your entire machine, making it a distributor of viruses and worms or a steppingstone in later break-ins of other machines.

A strategy known as buffer overflow (28.2   Stack Buffer Overflow) has been the basis for a great many total-compromise attacks. The idea is to identify a point in a server program where it fills a memory buffer with network-supplied data without careful length checking; almost any call to the C library function gets(buf) will suffice. The attacker then crafts an oversized input string which, when read by the server and stored in memory, overflows the buffer and overwrites subsequent portions of memory, typically containing the stack-frame pointers. The usual goal is to arrange things so that when the server reaches the end of the currently executing function, control is returned not to the calling function but instead to the attacker’s own payload code located within the string.

A firewall is a mechanism to block connections deemed potentially risky, eg those originating from outside the site. Generally ordinary workstations do not ever need to accept connections from the Internet; client machines instead initiate connections to (better-protected) servers. So blocking incoming connections works reasonably well; when necessary (eg for games) certain ports can be selectively unblocked.

The original firewalls were built into routers. Incoming traffic to servers was often blocked unless it was sent to one of a modest number of “open” ports; for non-servers, typically all inbound connections were blocked. This allowed internal machines to operate reasonably safely, though being unable to accept incoming connections is sometimes inconvenient.

Nowadays per-host firewalls – in addition to router-based firewalls – are common: you can configure your workstation not to accept inbound connections to most (or all) ports regardless of whether software on the workstation requests such a connection. Outbound connections can, in many cases, also be prevented.

**Useful Network Utilities For Diagnosing Network Issues**


Ping is useful to determine if another machine is accessible, eg

ifconfig, ipconfig, ip

To find your own IP address you can use ipconfig on Windows, ifconfig on Linux and Macintosh systems, or the newer ip addr list on Linux. The output generally lists all active interfaces but can be restricted to selected interfaces if desired. The ip command in particular can do many other things as well. The Windows command netsh interface ip show config also provides IP addresses.


nslookup, dig and host

This trio of programs, all developed by the Internet Systems Consortium, are all used for DNS lookups. They differ in convenience and options. The oldest is nslookup, the one with the most options (by a rather wide margin) is dig, and the newest and arguably most convenient for normal usage is host.

traceroute

This lists the route from you to a remote host:

route and netstat

The commands route, route print (Windows), ip route show (Linux), and netstat -r (all systems) display the host’s local IP forwarding table. For workstations not acting as routers, this includes the route to the default router and, usually, not much else. The default route is sometimes listed as destination 0.0.0.0 with netmask 0.0.0.0 (equivalent to 0.0.0.0/0).

The command netstat -a shows the existing TCP connections and open UDP sockets.

netcat

The netcat program, often called nc, allows the user to create TCP or UDP connections and send lines of text back and forth. It is seldom included by default. See 16.1.4   netcat and 17.7.1   netcat again.

WireShark

This is a convenient combination of packet capture and packet analysis, from wireshark.org. See 17.4   TCP and WireShark and 12.4   Using IPv6 and IPv4 Together for examples.

WireShark was originally named Etherreal. An earlier command-line-only packet-capture program is tcpdump, though WireShark has greatly expanded support for packet-format decoding. Both WireShark and tcpdump support both live packet capture and reading from .pcap (packet capture) and .pcapng (next generation) files.




The OSI  created the 7 layer networking model. Adding the Session and Presentation layers 

The Session layer was to handle “sessions” between applications (including the graceful closing of Transport-layer connections, something included in TCP, and the re-establishment of “broken” Transport-layer connections, which TCP could sorely use), and the Presentation layer was to handle things like defining universal data formats (eg for binary numeric data, or for non-ASCII character sets), and eventually came to include compression and encryption as well. Data presentation and session management are important concepts, but in many cases it has not proved necessary, or even particularly useful, to make them into true layers. The layer approach has been very helpful in organizing networking software into separate sections, but is hard to define precisely. One approach is to declare that a layer should communicate directly only with the layers immediately above and below it. The application passes its data to the Transport layer to receive the Transport header, which passes the data to the IP layer to receive the IP header, and on to the LAN layer. Each layer can be seen as an encapsulated software object, or module, by the layer above, and each layer in turn encapsulates the packet from its parent layer by adding a new header. This is mostly true for the Transport, IP and LAN layers, but there are irregularities: the transport-layer checksum, for example, needs information from the IP layer, and may in fact end up being calculated at the LAN layer Even allowing for these kinds of irregularities, however, it is hard to justify full-fledged layer status for the Session and Presentation actions. What often happens is that the Application layer manages its own Transport connections, and is responsible for reading and writing data directly from and to the Transport layer. The application then uses conventional libraries for Presentation actions such as encryption, compression and format translation, and for Session actions such as handling broken Transport connections and multiplexing streams of data over a single Transport connection.

An opposing view is that it is possible to view the SSL/TLS transport-encryption service, 29.5.2   TLS, as an example of a true Presentation layer. Applications generally read and write data directly to the SSL/TLS endpoint, which in turn mostly encapsulates (as a software module) the underlying TCP connection. The encapsulation is incomplete, though, in that SSL/TLS applications generally are responsible for creating their own Transport-layer (TCP) connections; see 29.5.3   A TLS Programming Example and the note at the end of 29.5.3.2   TLSserver. In the end, while the seven-layer model is reasonably popular, from a software-architecture standpoint those two extra layers aren’t really in the same league as those of the five-layer model.

**VPNs**

Suppose you want to connect to your workplace network from home. Your workplace, however, has a security policy that does not allow “outside” IP addresses to access essential internal resources. How do you proceed, without leasing a dedicated telecommunications line to your workplace?

A virtual private network, or VPN, provides a solution; it supports creation of virtual links that join far-flung nodes via the Internet. Your home computer creates an ordinary Internet connection (TCP or UDP) to a workplace VPN server (IP-layer packet encapsulation can also be used, and avoids the timeout problems sometimes created by sending TCP packets within another TCP stream; see 9.9   Mobile IP). Each end of the connection is typically associated with a software-created virtual network interface; each of the two virtual interfaces is assigned an IP address. (Virtual interfaces are not essential; VPNs created with IPsec, 29.6   IPsec, generally omit them.) When a packet is to be sent along the virtual link, it is actually encapsulated and sent along the original Internet connection to the VPN server, wending its way through the commodity Internet; this process is called tunneling. To all intents and purposes, the virtual link behaves like any other physical link.

Tunneled packets are often encrypted as well as encapsulated, though that is a separate issue. One relatively easy-to-implement example of a tunneling mechanism is to treat a TCP home-workplace connection as a serial line and send packets over it back-to-back, using PPP with HDLC; see 6.1.5.1   HDLC and RFC 1661 (though this can lead to the above-mentioned TCP-in-TCP timeout problems).

After the VPN is set up, the home host’s tun0 interface appears to be locally connected to Site A, and thus the home host is allowed to connect to the private area within Site A. The home host’s forwarding table will be configured so that traffic to Site A’s private addresses is routed via interface tun0.

VPNs are also commonly used to connect entire remote offices to headquarters. In this case the remote-office end of the tunnel will be at that office’s local router, and the tunnel will carry traffic for all the workstations in the remote office.

Other applications of VPNs include trying to appear geographically to be at another location, and bypassing firewall rules blocking specific TCP or UDP ports.

To improve security, it is common for the residential (or remote-office) end of the VPN connection to use the VPN connection as the default route for all traffic except that needed to maintain the VPN itself. This may require a so-called host-specific forwarding-table entry at the residential end to allow the packets that carry the VPN tunnel traffic to be routed correctly via eth0. This routing strategy means that potential intruders cannot access the residential host – and thus the workplace internal network – through the original residential Internet access. A consequence is that if the home worker downloads a large file from a non-workplace site, it will travel first to the workplace, then back out to the Internet via the VPN connection, and finally arrive at the home.

ATM is a network mechanism intended to accommodate real-time traffic as well as bulk data transfer. We present ATM here as a LAN layer, for which it is still sometimes used, but it was originally proposed as a replacement for the IP layer as well, and, to an extent, the Transport layer. These broader plans were not greeted with universal enthusiasm within the IETF. When used as a LAN layer, IP packets are transmitted over ATM as in 5.5.1   ATM Segmentation and Reassembly.

A distinctive feature of ATM is its small packet size. ATM has its roots in the telephone industry, and was therefore particularly intended to support voice. A significant source of delay in voice traffic is the packet fill time: at DS0 speeds (64 kbps), voice data accumulates at 8 bytes/ms. If we are sending 1 kB packets, this means voice is delayed by about 1/8 second, meaning in turn that when one person stops speaking, the earliest they can hear the other’s response is 1/4 second later. Slightly smaller levels of voice delay can introduce an annoying echo. Smaller packets reduce the fill time and thus the delay: when voice is sent over IP (VoIP), one common method is to send 160 bytes every 20 ms.

ATM took this small-packet strategy even further: packets have 48 bytes of data, plus 5 bytes of header. Such small packets are often called cells. To manage such a small header, virtual-circuit routing is a necessity. IP packets of such small size would likely consume more than 50% of the bandwidth on headers, if the LAN header were included.

Aside from reduced voice fill-time, other benefits to small cells are reduced store-and-forward delay and minimal queuing delay, at least for high-priority traffic. Prioritizing traffic and giving precedence to high-priority traffic is standard, but high-priority traffic is never allowed to interrupt transmission already begun of a low-priority packet. If you have a high-priority voice cell, and someone else has a 1500-byte packet just started, your cell has to wait about 30 cell times, because 1500 bytes is about 30 cells. However, if their low-priority traffic is instead made up of 30 cells, you have only to wait for their first cell to finish; the delay is 1/30 as much.

ATM also made the decision to require fixed-size cells. The penalty for one partially used cell among many is small. Having a fixed cell size simplifies hardware design, and, in theory, allows it easier to design for parallelism.

Unfortunately, the designers of ATM also chose to mandate no cell reordering. This means cells can use a smaller sequence-number field, but also makes parallel switches much harder to build. A typical parallel switch design might involve distributing incoming cells among any of several input queues; the queues would then handle the VCI lookups in parallel and forward the cells to the appropriate output queues. With such an architecture, avoiding reordering is difficult. It is not clear to what extent the no-reordering decision was related to the later decline of ATM in the marketplace.

ATM cells have 48 bytes of data and a 5-byte header. The header contains up to 28 bits of VCI information, three “type” bits, one cell-loss priority, or CLP, bit, and an 8-bit checksum over the header only. The VCI is divided into 8-12 bits of Virtual Path Identifier and 16 bits of Virtual Channel Identifier, the latter supposedly for customer use to separate out multiple connections between two endpoints. Forwarding is by full switching only, and there is no mechanism for physical (LAN) broadcast.
5.5.1   ATM Segmentation and Reassembly

Due to the small packet size, ATM defines its own mechanisms for segmentation and reassembly of larger packets. Thus, individual ATM links in an IP network are quite practical. These mechanisms are called ATM Adaptation Layers, and there are four of them: AALs 1, 2, 3/4 and 5 (AAL 3 and AAL 4 were once separate layers, which merged). AALs 1 and 2 are used only for voice-type traffic; we will not consider them further.

The ATM segmentation-and-reassembly mechanism defined here is intended to apply only to large data; no cells are ever further subdivided. Furthermore, segmentation is always applied at the point where the data enters the network; reassembly is done at exit from the ATM path. IPv4 fragmentation, on the other hand, applies conceptually to IP packets, and may be performed by routers within the network.

For AAL 3/4, we first define a high-level “wrapper” for an IP packet, called the CS-PDU (Convergence Sublayer - Protocol Data Unit). This prefixes 32 bits on the front and another 32 bits (plus padding) on the rear. We then chop this into as many 44-byte chunks as are needed; each chunk goes into a 48-byte ATM payload, along with the following 32 bits worth of additional header/trailer:

    2-bit type field:
        10: begin new CS-PDU
        00: continue CS-PDU
        01: end of CS-PDU
        11: single-segment CS-PDU
    4-bit sequence number, 0-15, good for catching up to 15 dropped cells
    10-bit MessageID field
    CRC-10 checksum.

We now have a total of 9 bytes of header for 44 bytes of data; this is more than 20% overhead. This did not sit well with the IP-over-ATM community (such as it was), and so AAL 5 was developed.

AAL 5 moved the checksum to the CS-PDU and increased it to 32 bits from 10 bits. The MID field was discarded, as no one used it, anyway (if you wanted to send several different types of messages, you simply created several virtual circuits). A bit from the ATM header was taken over and used to indicate:

    1: start of new CS-PDU
    0: continuation of an existing CS-PDU

The CS-PDU is now chopped into 48-byte chunks, which are then used as the entire body of each ATM cell. With 5 bytes of header for 48 bytes of data, overhead is down to 10%. Errors are detected by the CS-PDU CRC-32. This also detects lost cells (impossible with a per-cell CRC!), as we no longer have any cell sequence number.

For both AAL3/4 and AAL5, reassembly is simply a matter of stringing together consecutive cells in order of arrival, starting a new CS-PDU whenever the appropriate bits indicate this. For AAL3/4 the receiver has to strip off the 4-byte AAL3/4 headers; for AAL5 the receiver has to verify the CRC-32 checksum once all cells are received. Note that this strategy can fail without the general ATM requirement of no cell reordering, above. Different cells from different virtual circuits can be jumbled together on the ATM “backbone”, but on any one virtual circuit the cells from one higher-level packet must be sent one right after the other.

A typical IP packet divides into about 20 cells. For AAL 3/4, this means a total of 200 bits devoted to CRC codes, versus only 32 bits for AAL 5. It might seem that AAL 3/4 would be more reliable because of this, but, paradoxically, it was not! The reason for this is that errors are rare, and so we typically have one or at most two per CS-PDU. Suppose we have only a single error, ie a single cluster of corrupted bits small enough that it is likely confined to a single cell. In AAL 3/4 the CRC-10 checksum will fail to detect that error (that is, the checksum of the corrupted packet will by chance happen to equal the checksum of the original packet) with probability 1/210. The AAL 5 CRC-32 checksum, however, will fail to detect the error with probability 1/232. Even if there are enough errors that two cells are corrupted, the two CRC-10s together will fail to detect the error with probability 1/220; the CRC-32 is better. AAL 3/4 is more reliable only when we have errors in at least four cells, at which point we might do better to switch to an error-correcting code.

**Moral: one checksum over the entire message is often better than multiple shorter checksums over parts of the message.**




# **Links**

At the lowest (logical) level, network links look like serial lines. In this chapter we address how packet structures are built on top of serial lines, via encoding and framing. Encoding determines how bits and bytes are represented on a serial line; framing allows the receiver to identify the beginnings and endings of packets.

We then conclude with the high-speed serial lines offered by the telecommunications industry, T-carrier and SONET, upon which almost all long-haul point-to-point links that tie the Internet together are based.

**Encoding and Framing**

A typical serial line is ultimately a stream of bits, not bytes. How do we identify byte boundaries? This is made slightly more complicated by the fact that, beneath the logical level of the serial line, we generally have to avoid transmitting long runs of identical bits, because the receiver may simply lose count; this is the clock synchronization problem (sometimes called the clock recovery problem). This means that, one way or another, we cannot always just send the desired bits sequentially; for example, extra bits are often inserted to break up long runs. Exactly how we do this is the encoding mechanism.

Once we have settled the transmission of bits, the next step is to determine how the receiver identifies the start of each new packet. Ethernet packets are separated by physical gaps, but for most other link mechanisms packets are sent end-to-end, with no breaks. How we tell when one packet stops and the next begins is the framing problem.

To summarize:

**encoding: correctly recognizing all the bits in a stream**
**framing: correctly recognizing packet boundaries**

**<ins>Encoding</ins>**

NRZ (Non-Return to Zero) is perhaps the simplest encoding; it corresponds to direct bit-by-bit transmission of the 0’s and 1’s in the data. We have two signal levels, lo and hi, we set the signal to one or the other of these depending on whether the data bit is 0 or 1, as in the diagram below. Note that in the diagram the signal bits have been aligned with the start of the pulse representing that signal value.

One drawback to NRZ is that we cannot distinguish between 0-bits and a signal that is simply idle. However, the more serious problem is the lack of synchronization: during long runs of 0’s or long runs of 1’s, the receiver can “lose count”, eg if the receiver’s clock is running a little fast or slow. The receiver’s clock can and does resynchronize whenever there is a transition from one level to the other.


**<ins>Framing</ins>**


How does a receiver tell when one packet stops and the next one begins, to keep them from running together? We have already seen the following techniques for addressing this framing problem: determining where packets end:

    Interpacket gaps (as in Ethernet)
    4B/5B and special bit patterns

Putting a length field in the header would also work, in principle, but seems not to be widely used. One problem with this technique is that restoring order after desynchronization can be difficult.

There is considerable overlap of framing with encoding; for example, the existence of non-data bit patterns in 4B/5B is due to an attempt to solve the encoding problem; these special patterns can also be used as unambiguous frame delimiters.



## **Packets**

There are several contributing sources to the delay encountered in transmitting a packet. On a LAN, the most significant is usually what we will call bandwidth delay: the time needed for a sender to get the packet onto the wire. This is simply the packet size divided by the bandwidth, after everything has been converted to common units (either all bits or all bytes). For a 1500-byte packet on 100 Mbps Ethernet, the bandwidth delay is 12,000 bits / (100 bits/µsec) = 120 µsec.

There is also propagation delay, relating to the propagation of the bits at the speed of light (for the transmission medium in question). This delay is the distance divided by the speed of light; for 1,000 m of Ethernet cable, with a signal propagation speed of about 230 m/µsec, the propagation delay is about 4.3 µsec. That is, if we start transmitting the 1500 byte packet of the previous paragraph at time T=0, then the first bit arrives at a destination 1,000 m away at T = 4.3 µsec, and the last bit is transmitted at 120 µsec, and the last bit arrives at T = 124.3 µsec.

Minimizing Delay

Back in the last century, gamers were sometimes known to take advantage of players with slow (as in dialup) links; an opponent could be eliminated literally before he or she could respond. As an updated take on this, some financial-trading firms have set up microwave-relay links between trading centers, say New York and Chicago, in order to reduce delay. In computerized trading, milliseconds count. A direct line of sight from New York to Chicago – which we round off to 1200 km – takes about 4 ms in air, where signals propagate at essentially the speed of light c = 300 km/ms. But fiber is slower; even an absolutely straight run would take 6 ms at glass fiber’s propagation speed of 200 km/ms. In the presence of high-speed trading, this 2 ms savings is of considerable financial significance.

Bandwidth delay, in other words, tends to dominate within a LAN.

But as networks get larger, propagation delay begins to dominate. This also happens as networks get faster: bandwidth delay goes down, but propagation delay remains unchanged.

An important difference between bandwidth delay and propagation delay is that bandwidth delay is proportional to the amount of data sent while propagation delay is not. If we send two packets back-to-back, then the bandwidth delay is doubled but the propagation delay counts only once.

The introduction of switches leads to store-and-forward delay, that is, the time spent reading in the entire packet before any of it can be retransmitted. Store-and-forward delay can also be viewed as an additional bandwidth delay for the second link.

Finally, a switch may or may not also introduce queuing delay; this will often depend on competing traffic

Packet size is also influenced, to a modest degree, by the transmission error rate. For relatively high error rates, it turns out to be better to send smaller packets, because when an error does occur then the entire packet containing it is lost.

Small error rates

Generally, if the bit error rate p is small, we can approximate the probability of error in an N-bit packet as p×N, rather than working out the exact answer (assuming bit-error independence) of 1 − (1−p)N. This approximation works best if p×N is also small. For the 1000-bit example here with p=1/10,000, the exact value of the success rate is 90.4833% versus the p×N approximation of 90%. For the 10,000-bit packet, though, the p×N approximation predicts a 100% chance of error, which is not very helpful at all.

For example, suppose that 1 bit in 10,000 is corrupted, at random, so the probability that a single bit is transmitted correctly is 0.9999 (this is much higher than the error rates encountered on real networks). For a 1000-bit packet, the probability that every bit in the packet is transmitted correctly is (0.9999)1000, or about 90.5%. For a 10,000-bit packet the probability is (0.9999)10,000 ≃ 37%. For 20,000-bit packets, the success rate is below 14%.

Now suppose we have 1,000,000 bits to send, either as 1000-bit packets or as 20,000-bit packets. Nominally this would require 1,000 of the smaller packets, but because of the 90% packet-success rate we will need to retransmit 10% of these, or 100 packets. Some of the retransmissions may also be lost; the total number of packets we expect to need to send is about 1,000/90% ≃ 1,111, for a total of 1,111,000 bits sent. Next, let us try this with the 20,000-bit packets. Here the success rate is so poor that each packet needs to be sent on average seven times; lossless transmission would require 50 packets but we in fact need 7×50 = 350 packets, or 7,000,000 bits.

Moral: choose the packet size small enough that most packets do not encounter errors.


**Error Detection**

The basic strategy for packet error detection is to add some extra bits – formally known as an error-detection code – that will allow the receiver to determine if the packet has been corrupted in transit. A corrupted packet will then be discarded by the receiver; higher layers do not distinguish between lost packets and those never received. While packets lost due to bit errors occur much less frequently than packets lost due to queue overflows, it is essential that data be received accurately.

Intermittent packet errors generally fall into two categories: low-frequency bit errors due to things like cosmic rays, and interference errors, typically generated by nearby electrical equipment. Errors of the latter type generally occur in bursts, with multiple bad bits per packet. Occasionally, a malfunctioning network device will introduce bursty errors as well.

Networks v Refrigerators

At Loyola we once had a workstation used as a mainframe terminal that kept losing its connection. We eventually noticed that the connection dropped every time the office refrigerator kicked on. Sure enough, the cable ran directly behind the fridge; rerouting it solved the problem.

The simplest error-detection mechanism is a single parity bit; this will catch all one-bit errors. There is, however, no straightforward generalization to N bits! That is, there is no N-bit error code that catches all N-bit errors; see exercise 11.0.

The so-called Internet checksum, used by IP, TCP and UDP, is formed by taking the ones-complement sum of the 16-bit words of the message. Ones-complement is an alternative way of representing signed integers in binary; if one adds two positive integers and the sum does not overflow the hardware word size, then ones-complement and the now-universal twos-complement are identical. To form the ones-complement sum of 16-bit words A and B, first take the ordinary twos-complement sum A+B. Then, if there is an overflow bit, add it back in as low-order bit. Thus, if the word size is 4 bits, the ones-complement sum of 0101 and 0011 is 1000 (no overflow). Now suppose we want the ones-complement sum of 0101 and 1100. First we take the “exact” sum and get 1|0001, where the leftmost 1 is an overflow bit past the 4-bit wordsize. Because of this overflow, we add this bit back in, and get 0010.


**Cylical Redundancy Check**

The CRC error code is based on long division of polynomials, where the coefficients are integers modulo 2. The use of polynomials tends to sound complicated but in fact it eliminates the need for carries or borrowing in addition and subtraction. Together with the use of modulo-2 coefficients, this means that addition and subtraction become equivalent to XOR. We treat the message, in binary, as a giant polynomial m(X), using the bits of the message as successive coefficients (eg 10011011 = X7 + X4 + X3 + X + 1). We standardize a divisor polynomial p(X) of degree N (N=32 for CRC-32 codes); the full specification of a given CRC code requires giving this polynomial. (A full specification also requires spelling out the bit order within bytes.) We append N 0-bits to m(X) (this is the polynomial XNm(X)), and divide the result by p(X). The “checksum” is the remainder r(X), of maximum degree N−1 (that is, N bits).

This is a reasonably secure hash against real-world network corruption, in that it is very hard for systematic errors to result in the same hash code. However, CRC is not secure against intentional corruption; given an arbitrary message msg, there are straightforward algebraic means for tweaking the last bytes of msg so that the CRC code of the result is equal to any predetermined value in the appropriate range.

As an example of CRC, suppose that the CRC divisor is 1011 (making this a CRC-3 code) and the message is 1001 1011 1100. Here is the division; we repeatedly subtract (using XOR) a copy of the divisor 1011, shifted so the leading 1 of the divisor lines up with the leading 1 of the previous difference. A 1 then goes on the quotient line, lined up with the last digit of the shifted divisor; otherwise a 0. There are several online calculators for this sort of thing, eg here. Note that an extra 000 has been appended to the dividend.

The remainder, at the bottom, is 101; this is the N-bit CRC code. We then append the code to the original message, that is, without the added zeroes: 1001 1011 1100 101; algebraically this is XNm(X) + r(X). This is what is actually transmitted; if converted to a polynomial, it yields a remainder of zero upon division by p(X). This slightly simplifies the receiver’s job of validating the CRC code: it just has to check that the remainder is zero.

CRC is easily implemented in hardware, using bit-shifting registers. Fast software implementations are also possible, usually involving handling the bits one byte at a time, with a precomputed lookup table with 256 entries.

If we randomly change enough bits in packet P1 to create P2, then CRC(P1) and CRC(P2) are effectively independent random variables, with probability of a match 1 in 2N where N is the CRC length. However, if we change just a few bits then the change is not so random. In particular, for many CRC codes (that is, for many choices of the underlying polynomial p(X)), changing up to three bits in P1 to create a new message P2 guarantees that CRC(P1) ≠ CRC(P2). For the Internet checksum, this is not guaranteed even if we know only two bits were changed.

Finally, there are also secure hashes, such as MD-5 and SHA-1 and their successors (28.6   Secure Hashes). Nobody knows (or admits to knowing) how to produce two messages with same hash here. However, these secure-hash codes are generally not used in network error-correction as they are much slower to calculate than CRC; they are generally used only for secure authentication and other higher-level functions.


How do you make packet sending reliable?



In this chapter we take a general look at how to build reliable data-transport layers on top of unreliable lower layers. This is achieved through a retransmit-on-timeout policy; that is, if a packet is transmitted and there is no acknowledgment received during the timeout interval then the packet is resent. As a class, protocols where one side implements retransmit-on-timeout are known as ARQ protocols, for Automatic Repeat reQuest. In addition to reliability, we also want to keep as many packets in transit as the network can support. 

**Stop and Wait**

In the stop-and-wait version of retransmit-on-timeout, the sender sends only one outstanding packet at a time. If there is no response, the packet may be retransmitted, but the sender does not send Data[N+1] until it has received ACK[N]. Of course, the receiving side will not send ACK[N] until it has received Data[N]; each side has only one packet in play at a time. A packet that must be resent is experienced as a delay in receiving time.

Flow Control-Stop-and-wait also provides a simple form of flow control to prevent data from arriving at the receiver faster than it can be handled. Assuming the time needed to process a received packet is less than one RTT, the stop-and-wait mechanism will prevent data from arriving too fast. If the processing time is slightly larger than RTT, all the receiver has to do is to wait to send ACK[N] until Data[N] has not only arrived but also been processed, and the receiver is ready for Data[N+1]. 

Stop-and-wait is reliable but it is not very efficient


**IP v4**

IPv4 (and IPv6) is, in effect, a universal routing and addressing protocol. Routing and addressing are developed together; every node has an IP address and every router knows how to handle IP addresses. IP was originally seen as a way to interconnect multiple LANs, but it may make more sense now to view IP as a virtual LAN overlaying all the physical LANs.

A crucial aspect of IP is its scalability. As of 2019 the Internet had over 109 hosts; this estimate is probably low. However, at the same time the size of the largest forwarding tables was still under 106 (15.5   BGP Table Size). Ethernet, in comparison, scales poorly, as the forwarding tables need one entry for every active host.

The IPv4 Header needs to contain the following information:

    destination and source addresses
    indication of ipv4 versus ipv6
    a Time To Live (TTL) value, to prevent infinite routing loops
    a field indicating what comes next in the packet (eg TCP v UDP)
    fields supporting fragmentation and reassembly.

The Time-to-Live (TTL) field is decremented by 1 at each router; if it reaches 0, the packet is discarded. A typical initial value is 64; it must be larger than the total number of hops in the path. In most cases, a value of 32 would work. The TTL field is there to prevent routing loops – always a serious problem should they occur – from consuming resources indefinitely. Later we will look at various IP routing-table update protocols and how they minimize the risk of routing loops; they do not, however, eliminate it. By comparison, Ethernet headers have no TTL field, but Ethernet also disallows cycles in the underlying topology.

The Protocol field contains a value to identify the contents of the packet body. A few of the more common values are

    1: an ICMP packet, 10.4   Internet Control Message Protocol
    4: an encapsulated IPv4 packet, 9.9.1   IP-in-IP Encapsulation
    6: a TCP packet
    17: a UDP packet
    41: an encapsulated IPv6 packet, 12.6   IPv6 Connectivity via Tunneling
    50: an Encapsulating Security Payload, 29.6   IPsec


What do you do if your ISP assigns to you a single IPv4 address and you have two computers? The solution is Network Address Translation, or NAT. NAT’s ability to “multiplex” an arbitrarily large number of individual hosts behind a single IPv4 address (or small number of addresses) makes it an important tool in the conservation of IPv4 addresses. It also, however, enables an important form of firewall-based security. It is documented in RFC 3022, where this is called NAPT, or Network Address Port Translation. Another term in common use is IP masquerading.



**IPv4 Companion Protocols**



The Domain Name System, DNS, is an essential companion protocol to IPv4 (and IPv6); an overview can be found in RFC 1034. It is DNS that permits users the luxury of not needing to remember numeric IP addresses. Instead of 162.216.18.28, a user can simply enter intronetworks.cs.luc.edu, and DNS will take care of looking up the name and retrieving the corresponding address. DNS also makes it easy to move services from one server to another with a different IP address; as users will locate the service by DNS name and not by IP address, they do not need to be notified.

While DNS supports a wide variety of queries, for the moment we will focus on queries for IPv4 addresses, or so-called A records. The AAAA record type is used for IPv6 addresses, and, internally, the NS record type is used to identify the “name servers” that answer DNS queries.

While a workstation can use TCP/IP without DNS, users would have an almost impossible time finding anything, and so the core startup configuration of an Internet-connected workstation almost always includes the IP address of its DNS server (see 10.3   Dynamic Host Configuration Protocol (DHCP) below for how startup configurations are often assigned).

It’s Always DNS

That is a common, though exaggerated, sentiment among system administrators dealing with network problems. While DNS is on the whole remarkably reliable, its failures can be tricky to diagnose.

Most DNS traffic today is over UDP, although a TCP option exists. Due to the much larger response sizes, TCP is often necessary for DNSSEC (29.7   DNSSEC).

DNS is distributed, meaning that each domain is responsible for maintaining its own DNS servers to translate names to addresses. DNS, in fact, is a classic example of a highly distributed database where each node maintains a relatively small amount of data. That said, in days gone by it was common practice for each domain to maintain its own DNS server; today, domain registrars often provide DNS services for many of their domain customers.

DNS is hierarchical as well; for the DNS name intronetworks.cs.luc.edu the levels of the hierarchy are

    edu: the top-level domain (TLD) for educational institutions in the US
    luc: Loyola University Chicago
    cs: The Loyola Computer Science Department
    intronetworks: a hostname associated to a specific IP address



he hierarchy of DNS names (that is, the set of all names and suffixes of names) forms a tree, but it is not only leaf nodes that represent individual hosts. In the example above, domain names luc.edu and cs.luc.edu happen to be valid hostnames as well.

The DNS hierarchy is in a great many cases not very deep, particularly for DNS names assigned to commercial websites. Such domain names are often simply the company name (or a variant of it) followed by the top-level domain (often .com). Still, internally most organizations have many individually named behind-the-scenes servers with three-level (or more) domain names; sometimes some of these can be identified by viewing the source of the web page and searching it for domain names.

Top-level domains are assigned by ICANN. The original top-level domains were seven three-letter domains – .com, .net, .org, .int, .edu, .mil and .gov – and the two-letter country-code domains (eg .us, .ca, .mx). Now there are hundreds of non-country top-level domains, such as .aero, .biz, .info, and, apparently, .wtf. Domain names (and subdomain names) can also contain unicode characters, so as to support national alphabets. Some top-level domains are generic, meaning anyone can apply for a subdomain although there may be qualifying criteria. Other top-level domains are sponsored, meaning the sponsoring organization determines who can be assigned a subdomain, and so the qualifying criteria can be a little more arbitrary.

ICANN still must approve all new top-level domains. Applications are accepted only during specific intervals; the application fee for the 2012 interval was US$185,000. The actual leasing of domain names to companies and individuals is done by organizations known as domain registrars who work under contract with ICANN.

The full tree of all DNS names and prefixes is divided administratively into zones: a zone is an independently managed subtree, minus any sub-subtrees that have been placed – by delegation – into their own zone. Each zone has its own root DNS name that is a suffix of every DNS name in the zone. For example, the luc.edu zone contains most of Loyola’s DNS names, but cs.luc.edu has been spun off into its own zone. A zone cannot be the disjoint union of two subtrees; that is, cs.luc.edu and math.luc.edu must be two distinct zones, unless both remain part of their parent zone.

A zone can define DNS names more than one level deep. For example, the luc.edu zone can define records for the luc.edu name itself, for names with one additional level such as www.luc.edu, and for names with two additional levels such as www.cs.luc.edu. That said, it is common for each zone to handle only one additional level, and to create subzones for deeper levels.

Each zone has its own authoritative nameservers for the zone, which are charged with maintaining the records – known as resource records, or RRs – for that zone. Each zone must have at least two nameservers, for redundancy. IPv4 addresses are stored as so-called A records, for Address. Information about how to find sub-zones is stored as NS records, for Name Server. Additional resource-record types are discussed at 10.1.3   Other DNS Records. Each DNS record type also includes a time-to-live field for caching (below).

An authoritative nameserver need not be part of the organization that manages the zone, and a single server can be the authoritative nameserver for multiple unrelated zones. For example, many domain registrars maintain single nameservers that handle DNS queries for all their domain customers who do not wish to set up their own nameservers.

The root nameservers handle the zone that is the root of the DNS tree; that is, that is represented by the DNS name that is the empty string. As of 2019, there are thirteen of them. The root nameservers contain only NS records, identifying the nameservers for all the immediate subzones. Each top-level domain is its own such subzone. The IP addresses of the root nameservers are widely distributed. Their DNS names (which are only of use if some DNS lookup mechanism is already present) are a.root.servers.net through m.root-servers.net. These names today correspond not to individual machines but to clusters of up to hundreds of servers.














**DNS Resolvers**

We can now put together a first draft of a DNS lookup algorithm. To find the IP address of intronetworks.cs.luc.edu, a host first contacts a root nameserver (at a known address) to find the nameserver for the edu zone; this involves the retrieval of an NS record. The edu nameserver is then queried to find the nameserver for the luc.edu zone, which in turn supplies the NS record giving the address of the cs.luc.edu zone. This last has an A record for the actual host. (This example is carried out in detail below.) The system (or application) that executes these DNS lookups is known as a DNS resolver. Confusingly, resolvers are also sometimes known as “nameservers” or, more precisely, non-authoritative nameservers.

To reduce overall DNS traffic, in particular to the root nameservers, it makes sense to cache intermediate (and final) results, so that in a later query for, say, uchicago.edu, the host can reuse the previously learned address of the edu nameserver.

For still greater DNS efficiency, we can provide one DNS resolver to handle requests for a large pool of users. The idea is that, if one user has looked up youtube.com, or facebook.com, those addresses are in hand locally for the next user. The benefit of this consolidation approach depends on the distribution of lookup requests, their lifetimes, and how likely it is that two users visit the same site. In recent years this caching benefit has been getting smaller, at least for “full” DNS names, as the Internet becomes more diverse, and as cache lifetimes have been shrinking. (The caching benefit for DNS “partial” names, such as .edu and .com, remains significant.)

Regardless of caching benefits, such pooled-use DNS resolvers are almost universally used. Almost all ISPs and most companies, for example, provide a resolver to handle the DNS needs of their customers and employees. We will refer to these as site resolvers. The IP addresses of these site resolvers are generally supplied via DHCP options (10.3   Dynamic Host Configuration Protocol (DHCP)); such resolvers are thus the default choice for DNS services.

DNS Policing

It is sometimes suggested that if a site is engaged in illegal activity or copyright infringement, such as thepiratebay.se, its domain name should be seized. The problem with this strategy is that it is straightforward for users to set up “nonstandard” nameservers (for example the Gnu Name System, GNS) that continue to list the banned site.

Sometimes, however, users elect to use a DNS resolver not provided by their ISP or company; there are a number of public DNS servers (that is, resolvers) available. Such resolvers generally serve much larger areas. Common choices include OpenDNS, Google DNS (primary address 8.8.8.8), Cloudflare (primary address 1.1.1.1) and the Gnu Name System mentioned in the sidebar above, though there are many others. Searching for “public DNS server” turns up lists of them.



If we look up both www.cs.luc.edu and cs.luc.edu, we see they resolve to the same address. The use of www as a hostname for a domain’s webserver is sometimes considered unnecessary and old-fashioned; many users and website administrators prefer the shorter, “naked” domain name, eg cs.luc.edu.

**DNS cache poisoning**
The classic DNS security failure, known as cache poisoning, occurs when an attacker has been able to convince a DNS resolver that the address of, say, www.example.com is something other than what it really is. A successful attack means the attacker can direct traffic meant for www.example.com to the attacker’s own, malicious site.

The most basic cache-poisoning strategy is to send a stream of DNS reply packets to the resolver which declare that the IP address of www.example.com is the attacker’s chosen IP address. The source IP address of these packets should be spoofed to be that of the example.com authoritative nameserver; such spoofing is relatively easy using UDP. Most of these reply packets will be ignored, but the hope is that one will arrive shortly after the resolver has sent a DNS request to the example.com authoritative nameserver, and interprets the spoofed reply packet as a legitimate reply.

To prevent this, DNS requests contain a 16-bit ID field; the DNS response must echo this back. The response must also come from the correct port. This leaves the attacker to guess 32 bits in all, but often the ID field (and even more often the port) can be guessed based on past history.

Another approach requires the attacker to wait for the target resolver to issue a legitimate request to the attacker’s site, attacker.com. The attacker then piggybacks in the ADDITIONAL section of the reply message an A record for example.com pointing to the attacker’s chosen bad IP address for this site. The hope is that the receiving resolver will place these A records from the ADDITIONAL section into its cache without verifying them further and without noticing they are completely unrelated. Once upon a time, such DNS resolver behavior was common.

DNS is often pressed into service by CDNs (1.12.2   Content-Distribution Networks) to identify their closest “edge” server to a given user. Typically this involves the use of geoDNS, a slightly nonstandard variation of DNS. When a DNS query comes in to one of the CDN’s authoritative nameservers, that server

    looks up the approximate location of the client (14.4.4   IP Geolocation)
    determines the closest edge server to that location
    replies with the IP address of that closest edge server


**Internet Control Message Protocol**


The Internet Control Message Protocol, or ICMP, is a protocol for sending IP-layer error and status messages; it is defined in RFC 792. ICMP is, like IP, host-to-host, and so they are never delivered to a specific port, even if they are sent in response to an error related to something sent from that port. In other words, individual UDP and TCP connections do not receive ICMP messages, even when it would be helpful to get them.

ICMP messages are identified by an 8-bit type field, followed by an 8-bit subtype, or code. Here are the more common ICMP types, with subtypes listed in the description.

**IPv6**

What has been learned from experience with IPv4? First and foremost, more than 32 bits are needed for addresses; the primary motive in developing the new version of IP known as IPv6 was the specter of running out of IPv4 addresses (something which, at the highest level, has already happened; see the discussion at the end of 1.10   IP - Internet Protocol). Another important issue is that IPv4 requires (or used to require) a modest amount of effort at configuration; IPv6 was supposed to improve this.

By 1990 the IPv4 address-space issue was well understood, and the IETF was actively interested in proposals to replace IPv4. A working group for the so-called “IP next generation”, or IPng, was created in 1993 to select the new version; RFC 1550 was this group’s formal solicitation of proposals. In July 1994 the IPng directors voted to accept a modified version of the “Simple Internet Protocol Plus”, or SIPP (RFC 1710), as the basis for IPv6. The first IPv6 specifications, released in 1995, were RFC 1883 (now RFC 2460, with updates) for the basic protocol, and RFC 1884 (now RFC 4291, again with updates) for the addressing architecture.

IPv6 is now twenty years old, and yet usage as of 2015 remains quite modest. However, the shortage in IPv4 addresses has begun to loom ominously; IPv6 adoption rates may rise quickly if IPv4 addresses begin to climb in price.

The IPv6 fixed header is pictured below; at 40 bytes, it is twice the size of the IPv4 header. The fixed header is intended to support only what every packet needs: there is no support for fragmentation, no header checksum, and no option fields. However, the concept of extension headers has been introduced to support some of these as options; some IPv6 extension headers are described in 11.5   IPv6 Extension Headers. Whatever header comes next is identified by the Next Header field, much like the IPv4 Protocol field. Some other fixed-header fields have also been renamed from their IPv4 analogues: the IPv4 TTL is now the IPv6 Hop_Limit (still decremented by each router with the packet discarded when it reaches 0), and the IPv4 DS field has become the IPv6 Traffic Class.

IPv6 addresses are written in eight groups of four hex digits, with a-f preferred over A-F (RFC 5952). The groups are separated by colons, and have leading 0’s removed, eg

    fedc:13:1654:310:fedc:bc37:61:3210

If an address contains a long run of 0’s – for example, if the IPv6 address had an embedded IPv4 address – then when writing the address the string “::” should be used to represent however many blocks of 0000 as are needed to create an address of the correct length; to avoid ambiguity this can be used only once. Also, embedded IPv4 addresses may continue to use the “.” separator:

    ::ffff:147.126.65.141









































## <ins>**Miscellaneous**<ins>

**If sockets are faster than REST why not use a socket for any request instead of REST?**

    As with anything, there are pro’s and con’s to each approach, that only come into play depending on what your application is, and its requirements.

    Web sockets aren’t always faster. If your application needs to get data from your server, a web socket requires the entire connection to be setup before you can get the data, for single calls this is dramatically slower than a normal HTTP request. This becomes less of a problem if you use the same connection over time, which is where you could see small performance gains.

    However, there’s also the situation where you use a GET HTTP request for something you already got in the past, due to the nature of REST API’s, a GET is stateless, and thus could be cached by the browser and thus is nearly instant compared to a websocket call.

    Finally, speed isn’t everything. Sure your requests comeback milliseconds faster, but if your app needs to scale, websockets become more of a headache as you increased you own complexity dramatically with a websocket only setup, compared to the near universal support for HTTP requests that can be spread out any multitude of ways. Or if you aren’t leveraging the key feature of websockets, where a server can “tell” the client about something, you increased you own performance overhead for a minimal improvement in performance.

    I’d only go with a websocket only setup if you plan on leveraging the key features of websockets that aren’t available with HTTP requests. HTTP/REST API’s are too universal, too well documented, too well supported, and still run fast enough when done correctly to not use.


If you need a single connection kept open all the time to transfer data back and forth, Websockets are great. But the tradeoff is that it’s generally a bit more complicated and needs a lot more setup, and things like handling interrupted connections is a bit painful. Websockets are stateful, HTTP is not (the comparison is between WS and HTTP, REST is an architectural style). If you need real-time updates between two connected machines WS’ are pretty good, if you don’t then can take the much easier route of using the request-response model of HTTP.

By analogy, it’s like comparing telephone and sending letters as ways of communicating. The telephone is a lot more complex to set up, but enables people to talk in real-time. Letters are a lot simpler, but to have a conversation need to send one, them the recipient needs to send a reply and so on.


**What is a socket physically**

 22

I always prefer the pyhsical meaning of a programming concept to its logical meaning. So here comes this question.

As I review the socket programming paradigm, I noticed that what the bind(), connect() functions do are just like tuning the socket created by the socket() function. So I guess that what the socket() function does is just creating a data structure (and possibly a data structure in the kernel space) to hold the details about the end-to-end communication settings between the client and the server. And bind(), connect() just fill in that data structure.

I am not familiar with the implementation of the socket API, so I hope someone could address my concern.


+100

This is highly platform-dependent. The point of the API is so that you DON'T need to know these details.

If you're really interested in learning this (which you shouldn't be for just applications and system applications programming), you can download a linux kernel source archive from kernel.org and examine Linux's TCP/IP implementation by looking under net/ipv4

To add some clarity,

To transport data across the network, we usually adhere to standards defined by the International Standards Organization. They have a standard called the OSI, or Open Systems Interconnection, model.

This model defines 7 layers of abstraction for applications to move data across a network. I'll only talk about the first 4, as they are the the pertinent ones for your question.
Physical Layer:

This layer defines how the data is actually transmitted over the media. Hardware vendors adhere to defined standards on how to move the data. The standards agree on electrical signals and the electronic aspects of the data moving.
How it fits into the system:

Hopefully, there's very little software support required for this layer. Whatever programming is done here is likely to be done on-module and not in the kernel or application.
Data Link Layer:

This is the first layer that arguably involves some sort of programming. This layer defines the line-level protocols that operate on the physical links. Ethernet is one protocol. Frame relay is another. Token Ring is another. Each end of the link must be running the same data link protocol. This layer combines a compatible physical layer standard to give a means to actually transfer data from one host to another. In many regards it can be thought more of an appendix to the physical layer rather than its own layer, but because link-level protocols are defined here that's not a great analogy. This layer gives physical addresses to nodes on a network.
How it fits into the system:

You'd need to write a driver to talk to the interface module that runs these data-link protocols. Depending on the module and the system, the module may have all that it needs to actually work, or it may need some system-level help. Ideally, you just create a set of code interfaces (perhaps implemented as structs that contain function pointers for the appropriate handling of I/O.. I don't really know) and when you install a new physical module, a driver need only to implement those code interfaces and now your physical module is usable.
Network Layer

This is the layer that provides the ability to move data between networks (in the case of TCP/IP). The Internet Protocol is defined at this layer. This layer gives logical addresses to nodes so that they can be grouped into networks. By knowing what network (also called a subnet, determined programatically using the subnet mask) the host is on, we run algorithms that correctly move data from one network to another. If one host is on network A in China and one host is on network B in Australia, algorithms at this level are in charge of providing a path that links these networks and therefore these hosts.

An important thing about programming for this layer is that you should be able to just "plug in" any data link layer to transmit over. This means that once you create code on your system to transmit over Ethernet, Token Ring, 3G, or Frame Relay that you should be able to use all of them without the network layer needing to know what data link technology it is using. The logic of moving data between networks should not depend on the actual physical link it is operating on.

This layer puts your data into packets, and packets are what are routed over the internet.
How it fits into the system:

All of this layer must be coded as part of the system. It is entirely a software construct and should be isolated as much as possible from the data link layer. I am not enough of an expert to say in practice how well this is accomplished. Because the functionality of this layer is system-defined, we have total control over what the software must support. This makes the construction of the code interfaces that allow using this layer by higher-layer protocols rather simple compared to the ones in the data link layer.
Transport Layer:

This layer defines segmentation of data (because if you just sent giant pieces of data all at once, hardly anything would make it in order). This layer also defines TCP, which provides hand-shaking, checksums, packet ordering, variable data window sizes, and guaranteed reliabilty. TCP gives you the ability to create multiple logical channels of communication over the same physical link. It differentiates one coversation on a link from another conversation on the same link. UDP is also defined at this level, and can be thought of as an extremely light-weight TCP. UDP provided almost none of the beneifts of TCP but still provides the physical channel multiplexing.

If your transport layer is written well, your applications don't need (speaking from a code architecture standpoint) to worry about whether the transport layer is using TCP or UDP (just mentioning these two b/c the yare most popular on IP). While you may pick one or the other based on timing performance needs or reliability needs (and in practice, applications often make an assumption about which one they are running), your application doesn't need to have exact knowledge of which one is running.

Because this layer is built on top of the network layer, we don't need to worry about how our data will get from one host to another if they are on different networks. If a router is running a standard routing protocol, augmented by some statically-defined routes, we don't need to worry about that. It's all taken care of for us by the network layer. If the network-layer configuration changes on the host that we are running, it doesn't matter. We don't need to change our entire application to account for this.
How it fits into the system:

Very similar to network layer, except it provides different functionality than does the network layer. Additionally, these interfaces are used more in user-space than are the network layer interfaces. This is the layer that actually defines the sockets that you use in TCP/IP networking.

A socket is basically consistent of a source IP, source Port, destination IP and destination Port. (Physically, it really isn't anything, this is a software based concept) This way the operating system can tell which Application (through it's port number) needs to receive the packets or is sending out the packets.

The network stack (TCP/IP or OSI model) is implemented differently depending on your OS. If you want to learn more how packets are transferred and processed you study the OSI model or TCP/IP stack. This will tell you what happens to information as it leaves your application to be sent across a network.

The OS deals with handling the packets, so if you're a programmer, as said before, you're normally not interested in these details. 

re you familiar with the OSI model? bind() specifies the local IP address and port (layer 4) to use, so when the packet is physically sent out, it specifies that IP address as the sender, and connect() specifies the remote IP address and port to physically place in those packets.

As an aside, a lot of programming is pure "logic", and doesn't really have a "physical" meaning, unless by "physical" you actually mean "implementation detail", which will vary from platform to platform. If you're actually asking about the physical implementation meaning how "meaning" is transformed into electrical signals, you would probably be happier as a computer engineer than as a programmer.

<!-- 
<span style="font-sze:1.2em;"><ins>**Authentication**:</ins> </span>


* Something the user knows (password, PIN, pattern, etc.)
* Something the user has (SIM card, one-time password generator, or hardware token)
* A biometric property of the user (fingerprint, retina, voice)

<span style="font-sze:1.2em;"><ins>**Authorization**:</ins> the process of determining to which resources you have access (403 forbidden)</span> -->


<!-- ## **Password Security Considerations**

**Hashing:** 

**Salting:** 



**HTTPs**  -->

<!-- 

## **Maintaining State Between Requests**


### **Cookies**





### **Sessions** -->

