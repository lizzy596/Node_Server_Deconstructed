# **Chapter 20 - Networking Basics**


## **Objectives**

* **Understanding the basic layer model of networking** 

* **Describe and Implement Web, TCP and UDP sockets, explain each of their use cases, details the pros and cons of their respective uses and explain managing errors and security concerns**




### **Introduction**


<span style="font-size:1.2em;">Local Area Networks (LANs) are the physical networks that provide the connection between machines within for example a home or school. LANs are local, then IP (internet protocol) layer that provides an abstraction for connecting multiple LANS to the internet. Finally TCP addresses connections and the transport of user data.</span>

These three topics – LANs, IP and TCP – are often called layers; they constitute the Link layer, the Internetwork layer, and the Transport layer respectively. Together with the Application layer (the software you use), these form the “four-layer model” for networks. A layer, in this context, corresponds strongly to the idea of a programming interface or library, with the understanding that a given layer communicates directly only with the two layers immediately above and below it. An application hands off a chunk of data to the TCP library, which in turn makes calls to the IP library, which in turn calls the LAN layer for actual delivery. An application does not interact directly with the IP and LAN layers at all.


**<ins>The Physical Layer:</ins>**

The LAN layer is in charge of actual delivery of packets, using LAN-layer-supplied addresses. It is often conceptually subdivided into the “physical layer” dealing with, eg, the analog electrical, optical or radio signaling mechanisms involved, and above that an abstracted “logical” LAN layer that describes all the digital – that is, non-analog – operations on packets; see 2.1.4   The LAN Layer. The physical layer is generally of direct concern only to those designing LAN hardware; the kernel software interface to the LAN corresponds to the logical LAN layer.

Any one network connection – eg at the LAN layer – has a data rate: the rate at which bits are transmitted. In some LANs (eg Wi-Fi) the data rate can vary with time. Throughput refers to the overall effective transmission rate, taking into account things like transmission overhead, protocol inefficiencies and perhaps even competing traffic. It is generally measured at a higher network layer than the data rate.

The term bandwidth can be used to refer to either of these, though we here use it mostly as a synonym for data rate. The term comes from radio transmission, where the width of the frequency band available is proportional, all else being equal, to the data rate that can be achieved.

In discussions about TCP, the term goodput is sometimes used to refer to what might also be called “application-layer throughput”: the amount of usable data delivered to the receiving application. Specifically, retransmitted data is counted only once when calculating goodput but might be counted twice under some interpretations of “throughput”.

Data rates are generally measured in kilobits per second (kbps) or megabits per second (Mbps).




## Miscellaneous

**If sockets are faster than REST why not use a socket for any request instead of REST?**

    As with anything, there are pro’s and con’s to each approach, that only come into play depending on what your application is, and its requirements.

    Web sockets aren’t always faster. If your application needs to get data from your server, a web socket requires the entire connection to be setup before you can get the data, for single calls this is dramatically slower than a normal HTTP request. This becomes less of a problem if you use the same connection over time, which is where you could see small performance gains.

    However, there’s also the situation where you use a GET HTTP request for something you already got in the past, due to the nature of REST API’s, a GET is stateless, and thus could be cached by the browser and thus is nearly instant compared to a websocket call.

    Finally, speed isn’t everything. Sure your requests comeback milliseconds faster, but if your app needs to scale, websockets become more of a headache as you increased you own complexity dramatically with a websocket only setup, compared to the near universal support for HTTP requests that can be spread out any multitude of ways. Or if you aren’t leveraging the key feature of websockets, where a server can “tell” the client about something, you increased you own performance overhead for a minimal improvement in performance.

    I’d only go with a websocket only setup if you plan on leveraging the key features of websockets that aren’t available with HTTP requests. HTTP/REST API’s are too universal, too well documented, too well supported, and still run fast enough when done correctly to not use.


If you need a single connection kept open all the time to transfer data back and forth, Websockets are great. But the tradeoff is that it’s generally a bit more complicated and needs a lot more setup, and things like handling interrupted connections is a bit painful. Websockets are stateful, HTTP is not (the comparison is between WS and HTTP, REST is an architectural style). If you need real-time updates between two connected machines WS’ are pretty good, if you don’t then can take the much easier route of using the request-response model of HTTP.

By analogy, it’s like comparing telephone and sending letters as ways of communicating. The telephone is a lot more complex to set up, but enables people to talk in real-time. Letters are a lot simpler, but to have a conversation need to send one, them the recipient needs to send a reply and so on.

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









<!-- 
<span style="font-sze:1.2em;"><ins>**Authentication**:</ins> </span>
 the process of verifying that some entity is what it claims to be (401 unauthorized)
Authentication can be based on one or more of the following:

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

