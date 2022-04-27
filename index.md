<head>
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            inlineMath: [['$','$']]
            }
        });
    </script>
</head>
<br />
<center style="font-size:45px;color:green;line-height:-10px"> Visual-Aware Testing and Debugging for Web Optimization </center>

![license](https://img.shields.io/badge/platform-web-green "Platform")
![license](https://img.shields.io/badge/Licence-Apache%202.0-blue.svg "Apache")
![license](https://img.shields.io/badge/Version-Beta-yellow "Version")
## Table of Contents
[Introduction](#introduction)

[Data/Code Release](#data-and-code-release)

[Defects Found](#defects-found)

## Introduction
Web optimization services (WOSes) play a critical role in today’s web ecosystem by improving performance and saving traffic. However, WOSes are known for introducing visual distortions that disrupt user web experience. Unfortunately,
visual distortions are notoriously hard to analyze, test, and debug, due to their subjective measure, dynamic content, and sophisticated WOS implementations. In this paper, we present Vetter, a novel and effective system that automatically tests and debugs visual distortions. The key idea of Vetter is to reason about the morphology of web pages,
which describes the topological forms and scale-free geometrical structures of visual elements. Vetter efficiently calculates morphology and comparatively analyzes the morphologies
of web pages before and after a WOS as a differential test oracle. Such morphology analysis enables Vetter to detect visual distortions accurately and reliably (with 95% precision
and 91% recall). Vetter further diagnoses the detected visual distortions to pinpoint the root causes in WOS source code.
This is achieved by morphological causal inference, which localizes the offending visual elements that trigger the distortion and maps them to the corresponding code. We applied
Vetter to four representative WOS systems. Vetter discovers 21 unknown defects responsible for 98% visual distortions; 12 of them have been confirmed and 5 have been fixed.


## Data and Code Release
**Data Release.** We collected Chrome’s invocation logs of SKPaint APIs when visiting Alexa top and bottom 2,500 websites on Dec. 9th, 2021, which are available in the <a href="https://drive.google.com/drive/folders/186QVPhd5jGKOkaKUp0HYpbm4CQelOJsw?usp=sharing">Google Drive</a>. Besides, we have made part of our dataset available in <a href="https://drive.google.com/drive/folders/186QVPhd5jGKOkaKUp0HYpbm4CQelOJsw?usp=sharing">Google Drive</a> (the remaining part will be publicly available when the paper is published).

**Code Release.** Currently we are scrutinizing the codebase to avoid possible anonymity violation. To this end, we will release Vetter's source code in a module-by-module manner as soon as we have finished examining a module.
The codebase of Vetter is organized as follows.
```
Vetter
|---- Vetter_Testing
          |---- Morph_Instantiation_Minification
          |---- MorphSIM_Calculation
|---- Vetter_Debugging
          |---- Morph_Causal_Inference
          |---- Causality_Informed_Code_Analysis
```

The released part can be found <a href="https://github.com/Web-Distortion/Web-Distortion.github.io/tree/master/Vetter">here</a>.

## Defects Found
Below, we list all the defects we have found for four representative WOSes: Compy, Ziproxy, Fawkes, and Siploader.
Note that for Ziproxy, we mail the developers of Ziproxy with the defects we have found (together with our suggested fixes) through their official channels, but have not received the reply yet.

### Compy

| Index    | Description     | Issue/PR NO. | Current State |
| -------------- | ----------------------------------- | ------------------------|  ------------------------|
|1|Compy goes wrong when compressing some JPG/PNG images, which makes the images unable to load.| <a href="https://github.com/barnacs/compy/issues/63">Issue-63</a> & <a href="https://github.com/barnacs/compy/pull/70">PR-70</a> | Confirmed & Fixed |
|2|Compy fails to parse the compressed images.| <a href="https://github.com/barnacs/compy/issues/64">Issue-64</a> | Reported |
|3|Compy can't deal with the websocket, which fails some interaction tasks like chatrooms and online services.| <a href="https://github.com/barnacs/compy/issues/65">Issue-65</a> | Reported |
|4|Compy may block the redirecting process of some websites.| <a href="https://github.com/barnacs/compy/issues/66">Issue-66</a> & <a href="https://github.com/barnacs/compy/pull/68">PR-68</a> | Confirmed & Fixed |
|5|Compy can't support GIF images. | <a href="https://github.com/barnacs/compy/pull/70">PR-70</a> | Confirmed & Fixed |

### Ziproxy


| Index    | Description     | Issue/PR NO. | Current State |
| -------------- | ----------------------------------- | ------------------------|  ------------------------|
|1| Ziproxy goes wrong when compressing some contexts, which makes the original contexts become messy code. | - | Waiting For Reply |
|2| Ziproxy disturbs the loading sequence of JS files, leading to loading failure of  web pages. | - | Waiting For Reply |
|3| Ziproxy cannot handle GIF files, leading to image display error transcoding. | - | Waiting For Reply |
|4| Ziproxy causes conflicting fields in response header. | - | Waiting For Reply |

### Fawkes


| Index    | Description     | Issue/PR NO. | Current State |
| -------------- | ----------------------------------- | ------------------------|  ------------------------|
|1| Fawkes can't handle some elements whose innerText has multiple lines. | <a href="https://github.com/fawkes-nsdi20/fawkes/issues/14">Issue-14</a> | Reported |
|2| Fawkes mistakenly selects elements in template HTML | <a href="https://github.com/fawkes-nsdi20/fawkes/issues/13">Issue-13</a>  | Reported |

### SipLoader


| Index    | Description     | Issue/PR NO. | Current State |
| -------------- | ----------------------------------- | ------------------------|  ------------------------|
|1| SipLoader cannot track dependencies triggered by CSS files. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/1">Issue-1</a> | Confirmed |
|2| SipLoader cannot handle dependency loops among resources. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/2">Issue-2</a> | Confirmed |
|3| SipLoader cannot request cross-origin resources. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/3">Issue-3</a> | Confirmed |
|4| Disordered page loading of websites with multiple HTML files. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/4">Issue-4</a> | Confirmed |
|5| "404 Not Found" error when loading websites with multiple HTML files. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/5">Issue-5</a> | Confirmed |
|6| SipLoader cannot handle some dynamic resources. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/6">Issue-6</a> | Confirmed |
|7| A problem related to Chromium CDP used by SipLoader. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/7">Issue-7</a> | Confirmed |
|8| CSS abormality of some websites. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/8">Issue-8</a> & <a href="https://github.com/SipLoader/SipLoader.github.io/pull/9">PR-9</a> | Confirmed & Fixed |
|9| SipLoader fails to rewrite web page objects compressed by brotli. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/10">Issue-10</a> & <a href="https://github.com/SipLoader/SipLoader.github.io/pull/12">PR-12</a> | Confirmed & Fixed |
|10| SipLoader cannot distinguish between data URIs and real URLs in CSS files. | <a href="https://github.com/SipLoader/SipLoader.github.io/issues/11">Issue-11</a> & <a href="https://github.com/SipLoader/SipLoader.github.io/pull/9">PR-9</a> | Confirmed & Fixed |
