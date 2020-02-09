## Visuality-aware Testing for Web Optimization Proxies

### Introduction

Web optimization proxies (WOPs) play a critical role in today’s web ecosystem by effectively saving network traffic and page load time. On the other hand, they oftentimes bring visual distortion to the optimized web page and thus impair the user experience. In this paper we conduct a first comprehensive study on this issue, by measuring its realistic prevalence with respect to two popular WOPs (Ziproxy and Compy). We propose visuality-aware testing, a practical method to automatically detect visual distortions accurately and efficiently. We have fully implemented the visuality-aware testing system and applied it to Ziproxy and Compy. It can efficiently (costing an average of 62 ms per page) detect visual distortions with high precision (94%) and recall (92%). Based on visuality-aware testing, we further develop a semi-automatic diagnosis framework to pinpoint the root causes of visual distortion at source code level. With the diagnosis support, we successfully locate and fix a number of defects, including both design flaws and code bugs, in Ziproxy and Compy, resolving 98% of their incurred visual distortions.

### Visuality-aware Testing
We propose a novel testing methodology named visuality-aware testing for measuring the visual similarity between two pages. Visuality-aware testing is inspired by the scene graph, a conceptual data structure used in graphics to represent 2D/3D scenes. We thus create a novel data structure called Morphological Segmentation Tree (MST), which instantiates the scene graph concept to represent a web page. Then we design a heuristic algorithm that matches two MSTs and evaluate their similarity via GK-SIM. The code of GK-SIM calculation are available on [GitHub]().

### Defects of Ziproxy and Compy
By applying visuality-aware testing to Ziproxy and Compy, we discover six types of defects that can lead to visual distortions. We successfully fix them through source code modification and auxiliary middleware. The fixed version of Ziproxy and Compy coupled with auxiliary middleware[[s]] are available at [Github]().

### Raw Data
We collected Chrome’s invocation logs of SKPaint APIs when visiting Alexa top 10,000 websites on Oct. 9th, 2019, which are available in the [Google Driver](). 
