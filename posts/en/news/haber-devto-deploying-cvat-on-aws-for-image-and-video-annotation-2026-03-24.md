---
title: "Deploying CVAT on AWS for Image and Video Annotation"
date: "2026-03-24"
excerpt: "Building a computer vision model starts with labelled data, and that labelling work is where a..."
tags: ["Gündem", "Dev.to", "machinelearning", "computervision", "aws"]
category: "Gündem"
---

![Deploying CVAT on AWS for Image and Video Annotation](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fh969ay4054ylmrsflc4n.webp)

> **Kaynak:** Dev.to  &nbsp;·&nbsp;  **4 dk okuma**  &nbsp;·&nbsp;  **Yazar:** Gowtham

**Building a computer vision model starts with labelled data, and that labelling work is where a...**

Building a computer vision model starts with labelled data, and that labelling work is where a surprising amount of ML project time disappears. CVAT ([Computer Vision Annotation Tool](https://aws.amazon.com/marketplace/pp/prodview-ix6qaquyaj5w2?sr=0-10&ref=beagle&applicationId=AWSMPContessa)) is one of the strongest open-source options for the job. It handles bounding boxes, polygons, segmentation masks, keypoints, and object tracking across images and video.

The challenge most teams hit is not CVAT itself but the infrastructure around it. This post covers deploying a pre-configured CVAT environment on AWS EC2 so you can skip the Docker Compose setup and get straight to annotating.

Multi-format annotation - bounding boxes, polygons, segmentation masks, keypoints, ellipses, cuboids, and video object tracking

Export-ready datasets - YOLO (v5 through v11), COCO, Pascal VOC, TFRecord, and LabelMe formats

OpenCV-powered assists - semi-automatic annotation, keyframe interpolation on video, and label manipulation utilities

S3 storage integration - pre-wired, no manual boto3 configuration needed

Pre-configured environment - delivered ready to use; no Docker Compose debugging on first boot

Find the CVAT AMI in AWS Marketplace and subscribe. Choose Launch through EC2 rather than 1-Click, so you have full control over instance configuration before anything starts.

Instance type: t3.large works for individual annotators or small teams. For concurrent sessions or heavy video workloads, move to c5.2xlarge or above.

Key pair: Select or create one. You will need SSH access shortly to retrieve admin credentials.

Network settings: Allow inbound traffic on port 8080. Restrict the source to your team's IP range rather than leaving it open to all. For remote teams, placing CVAT behind an Application Load Balancer with HTTPS is worth the extra step before any production annotation begins.

Storage: Generous EBS sizing matters if you are working with video. Plan for at least 100 GB for any non-trivial dataset.

Once the instance is running, copy the Public IPv4 address from the EC2 dashboard and open:

On first load, you may see a "Cannot connect to the server" message. This is expected. The CVAT backend services take 60 to 90 seconds to fully initialise. Click OK, wait a moment, and refresh the page. The login screen will appear.

This outputs the auto-generated superuser username and password. Copy both and use them to sign in.

Once logged in, the pattern inside CVAT is consistent regardless of annotation type:

Create a project and define your label schema. Labels map directly to the classes your model will learn, for example, car, pedestrian, trafficlight, for a detection task.

Create a task inside the project. Upload raw images or a video file directly through the interface, or point to a pre-configured S3 bucket path.

Assign annotators using CVAT's built-in role system. Annotators label; reviewers validate before export. Rejected frames route back to annotators with comments, keeping quality control inside the same platform.

Exported archives include label files and images structured exactly as the framework expects. No post-processing or conversion step required.

Snapshot your configured instance. Once label schemas, user accounts, and storage integrations are set up the way you want, take an AMI snapshot. You can launch from it later if you need to scale to a larger instance type or recover quickly.

Back up annotation data. CVAT stores its database on the instance. Export completed tasks as archives before stopping or terminating the instance. A scheduled S3 sync of the CVAT data directory is good practice for ongoing projects.

Pre-annotation workflow. If you are partway through a training run, use early model checkpoints to generate draft annotations on unlabelled batches, import those predictions back into CVAT as pre-annotations, and have annotators correct rather than label from scratch. The time saved on large batches is substantial.

Annotation infrastructure is easy to underestimate, but the quality and consistency of your labelling pipeline have a direct effect on how quickly a model converges and how reliable its outputs are.

Running CVAT on your own EC2 environment keeps training data inside your own VPC, avoids per-seat SaaS pricing, and gives you a reproducible setup you can snapshot and relaunch at any point. The pre-configured AMI removes the setup friction that usually slows teams down when starting with self-hosted CVAT- [learn more](https://www.yobitel.com/single-post/yobitel-cvat-image-video-annotation-solutions)

---

[Orijinal makaleyi oku →](https://dev.to/gowtham21/deploying-cvat-on-aws-for-image-and-video-annotation-425i)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._