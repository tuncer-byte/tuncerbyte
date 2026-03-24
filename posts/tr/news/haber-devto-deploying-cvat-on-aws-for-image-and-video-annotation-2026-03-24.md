---
title: "Deploying CVAT on AWS for Image and Video Annotation"
date: "2026-03-24"
excerpt: "Building a computer vision model starts with labelled data, and that labelling work is where a..."
tags: ["Gündem", "Dev.to", "machinelearning", "c", "o"]
category: "Gündem"
---

**Building a computer vision model starts with labelled data, and that labelling work is where a...**

Building a computer vision model starts with labelled data, and that labelling work is where a surprising amount of ML project time disappears. CVAT ([Computer Vision Annotation Tool](https://aws.amazon.com/marketplace/pp/prodview-ix6qaquyaj5w2?sr=0-10&ref=beagle&applicationId=AWSMPContessa)) is one of the strongest open-source options for the job. It handles bounding boxes, polygons, segmentation masks, keypoints, and object tracking across images and video.

The challenge most teams hit is not CVAT itself but the infrastructure around it. This post covers deploying a pre-configured CVAT environment on AWS EC2 so you can skip the Docker Compose setup and get straight to annotating.

Multi-format annotation - bounding boxes, polygons, segmentation masks, keypoints, ellipses, cuboids, and video object tracking

Export-ready datasets - YOLO (v5 through v11), COCO, Pascal VOC, TFRecord, and LabelMe formats

OpenCV-powered assists - semi-automatic annotation, keyframe interpolation on video, and label manipulation utilities

---

**Kaynak:** Dev.to &nbsp;·&nbsp; **Yazar:** Gowtham &nbsp;·&nbsp; **Okuma süresi:** 4 dk

[Orijinal makaleyi oku](https://dev.to/gowtham21/deploying-cvat-on-aws-for-image-and-video-annotation-425i)

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._