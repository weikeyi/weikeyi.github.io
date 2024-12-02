## 卷积层

## 池化层

#### 为什么最大池化

提取特征（压缩

### 作用

减少参数

```py	
import torchvision
from torch import nn
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

train_set = torchvision.datasets.CIFAR10('./data',train=True,download=True,transform=torchvision.transforms.ToTensor())

dataloader = DataLoader(train_set,batch_size=64)


class Maxpool(nn.Module):
    def __init__(self):
        super(Maxpool,self).__init__()
        self.pool = nn.MaxPool2d(3,1)

    def forward(self, x):
        return self.pool(x)

maxpool = Maxpool()

writer = SummaryWriter("logs_maxpool")
step = 0
for data in dataloader:
    imgs , targets = data
    output = maxpool(imgs)
    writer.add_images('input',imgs,step)
    writer.add_images('output',output,step)
    step += 1
writer.close()
```

## 非线性激活

所以增加非线性的激活函数实际上是给模型增加非线性的表达能力或者因素，有了非线性函数模型的表达能力就会更强。整个模型就像活了一样，而不是想机器只会做单一的线性操作。

## 损失函数与反向传播

