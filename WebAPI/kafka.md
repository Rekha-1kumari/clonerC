### 1. Introduction to Kafka
Apache Kafka is a distributed streaming platform for building real‑time data pipelines and applications.
It allows publishing, subscribing, storing, and processing streams of records.
---
### 2. Kafka Architecture
Producer → sends messages to Kafka topics.
Broker → Kafka server that stores and serves messages.
Consumer → reads messages from topics.
Zookeeper → manages cluster metadata and leader election (though newer Kafka versions can run without it).
---
### 3. Topics
Logical channels where messages are published.
Example: chat-topic.
---
### 4. Partitions
Topics are split into partitions for scalability and parallelism.
Each partition is an ordered, immutable sequence of records.
---
### 5. Brokers
Kafka cluster consists of multiple brokers.
Each broker handles partitions and serves client requests.
---
### 6. Kafka in .NET
Use `Confluent.Kafka` NuGet package.
Provides producer and consumer APIs for C#.
---
### 7. Installation of Kafka
Download Kafka binaries from Apache Kafka.
Start Zookeeper:
`zookeeper-server-start.bat ..\..\config\zookeeper.properties`
Start Kafka broker:
`kafka-server-start.bat ..\..\config\server.properties`
---
### 8. Basics of Zookeeper
Coordinates brokers.
Maintains metadata (topics, partitions, offsets).
---
### 9. Demo
Create topic:
`kafka-topics.bat --create --topic chat-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1`
