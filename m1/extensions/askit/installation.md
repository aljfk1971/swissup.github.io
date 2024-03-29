---
layout: default
title: AskIt Installation
description: magento product questions askit module installation
keywords: " magento product questions module, product questions on magento
product page, magento askit module installation "
category: AskIt
---

# AskIt installation instructions

Please follow next steps to complete the installation:

1. Navigate to `Admin > Tools > Compilation` and deactivate the compilation
mode for your store.
2. Check if your Magento store cache is enabled.
3. Unpack all files from extension archive into your magento store root directory.
4. Refresh your magento store cache.
5. Logout from your store admin and then login back, to refresh your admin user
access rights.

* Navigate to `System > Configuration > Templates-Master > Askit` and
enable extension for any store you need.

* Please add the following code where you want to show Ask It product questions
block.

```html
<!-- AskIt start-->
<?php echo $this->helper('askit')->getLinkHtml($_product) ?>
<!-- AskIt end-->
```

That's all. Navigate to your store and check how it looks.

#### After you install an extension you can go to:

* [Support](https://swissuplabs.com/contacts/)
* [Forum](https://swissuplabs.com/magento-forum/)

