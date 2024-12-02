import{_ as i,c as a,a2 as n,o as h}from"./chunks/framework.BQmytedh.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"DeepLearning.md","filePath":"DeepLearning.md","lastUpdated":null}'),l={name:"DeepLearning.md"};function t(p,s,k,e,r,E){return h(),a("div",null,s[0]||(s[0]=[n(`<h2 id="卷积层" tabindex="-1">卷积层 <a class="header-anchor" href="#卷积层" aria-label="Permalink to &quot;卷积层&quot;">​</a></h2><h2 id="池化层" tabindex="-1">池化层 <a class="header-anchor" href="#池化层" aria-label="Permalink to &quot;池化层&quot;">​</a></h2><h4 id="为什么最大池化" tabindex="-1">为什么最大池化 <a class="header-anchor" href="#为什么最大池化" aria-label="Permalink to &quot;为什么最大池化&quot;">​</a></h4><p>提取特征（压缩</p><h3 id="作用" tabindex="-1">作用 <a class="header-anchor" href="#作用" aria-label="Permalink to &quot;作用&quot;">​</a></h3><p>减少参数</p><div class="language-py vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">py</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> torchvision</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> torch </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> nn</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> torch.utils.data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DataLoader</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> torch.utils.tensorboard </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SummaryWriter</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">train_set </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> torchvision.datasets.CIFAR10(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./data&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">train</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">download</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">transform</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">torchvision.transforms.ToTensor())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dataloader </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DataLoader(train_set,</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">batch_size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Maxpool</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    def</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> __init__</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(self):</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        super</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Maxpool,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">self</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">__init__</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        self</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.pool </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> nn.MaxPool2d(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> forward</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(self, x):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> self</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.pool(x)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">maxpool </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Maxpool()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">writer </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SummaryWriter(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;logs_maxpool&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">step </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dataloader:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    imgs , targets </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    output </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> maxpool(imgs)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    writer.add_images(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;input&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,imgs,step)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    writer.add_images(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;output&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,output,step)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    step </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">writer.close()</span></span></code></pre></div><h2 id="非线性激活" tabindex="-1">非线性激活 <a class="header-anchor" href="#非线性激活" aria-label="Permalink to &quot;非线性激活&quot;">​</a></h2><p>所以增加非线性的激活函数实际上是给模型增加非线性的表达能力或者因素，有了非线性函数模型的表达能力就会更强。整个模型就像活了一样，而不是想机器只会做单一的线性操作。</p><h2 id="损失函数与反向传播" tabindex="-1">损失函数与反向传播 <a class="header-anchor" href="#损失函数与反向传播" aria-label="Permalink to &quot;损失函数与反向传播&quot;">​</a></h2>`,10)]))}const o=i(l,[["render",t]]);export{g as __pageData,o as default};
