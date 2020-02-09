## Visuality-aware Testing for Web Optimization Proxies

### Introduction

Web optimization proxies (WOPs) play a critical role in to- day’s web ecosystem by effectively saving network traffic and page load time. On the other hand, they oftentimes bring visual distortion to the optimized web page and thus im- pair the user experience. In this paper we conduct a first comprehensive study on this issue, by measuring its realis- tic prevalence with respect to two popular WOPs (Ziproxy and Compy). We propose visuality-aware testing, a practical method to automatically detect visual distortions accurately and efficiently. We have fully implemented the visuality- aware testing system and applied it to Ziproxy and Compy. It can efficiently (costing an average of 62 ms per page) detect visual distortions with high precision (94%) and recall (92%). Based on visuality-aware testing, we further develop a semi- automatic diagnosis framework to pinpoint the root causes of visual distortion at source code level. With the diagnosis support, we successfully locate and fix a number of defects, including both design flaws and code bugs, in Ziproxy and Compy, resolving 98% of their incurred visual distortions.

### GK-SIM Calculation Code
we provide the GK-SIM calculation code [on Github]().
### Defect Ziproxy and Compy
We find six types of defects in Ziproxy and Compy as the root causes of visual distortions. We successfully fix them through source code modification and auxiliary middleware. After that, 98% distortions are resolved with negligible overhead.
### Raw Data
We collected Chrome’s invocation logs of SKPaint APIs when visiting Alexa top 10,000 websites on Oct. 9th, 2019. We release the data in the [Google Driver](). 
