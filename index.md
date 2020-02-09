# Visuality-aware Testing for Web Optimization Proxies

## Introduction

Web optimization proxies (WOPs) play a critical role in to- day’s web ecosystem by effectively saving network traffic and page load time. On the other hand, they oftentimes bring visual distortion to the optimized web page and thus im- pair the user experience. In this paper we conduct a first comprehensive study on this issue, by measuring its realis- tic prevalence with respect to two popular WOPs (Ziproxy and Compy). We propose visuality-aware testing, a practical method to automatically detect visual distortions accurately and efficiently. We have fully implemented the visuality- aware testing system and applied it to Ziproxy and Compy. It can efficiently (costing an average of 62 ms per page) detect visual distortions with high precision (94%) and recall (92%). Based on visuality-aware testing, we further develop a semi- automatic diagnosis framework to pinpoint the root causes of visual distortion at source code level. With the diagnosis support, we successfully locate and fix a number of defects, including both design flaws and code bugs, in Ziproxy and Compy, resolving 98% of their incurred visual distortions.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/Web-Distortion/Web-Distortion.github.io/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
