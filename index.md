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

[Bugs Found](#bugs-found)

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

## Bugs Found
Coming Soon!

