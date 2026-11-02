import type { TutorialData } from '../types';

export const tutorial: TutorialData = {
  "meta": {
    "titleEn": "Image Super-Resolution Using Deep Convolutional Networks",
    "titleZh": "使用深度卷积网络进行图像超分辨率重建",
    "venue": "IEEE TPAMI，2016",
    "authors": "Chao Dong、Chen Change Loy、Kaiming He、Xiaoou Tang",
    "affiliation": "香港中文大学信息工程系；微软亚洲研究院视觉计算组",
    "domain": "计算机视觉 · 单幅图像超分辨率",
    "coreProblem": "低分辨率图像对应多种可能的高分辨率细节，传统稀疏编码流程各步骤分开处理，整体优化与速度受限。",
    "coreInsight": "SRCNN 把传统稀疏编码式超分辨率中的特征提取、非线性映射和重建组织为三层卷积网络，并以重建误差端到端训练。",
    "keywords": [
      "超分辨率",
      "卷积神经网络",
      "稀疏编码"
    ]
  },
  "hero": {
    "oldMethod": {
      "desc": "传统稀疏编码将预处理、编码、字典重建和块融合分步处理。",
      "componentId": "hero-old"
    },
    "newMethod": {
      "desc": "SRCNN 把特征提取、非线性映射和重建放进三层卷积网络，并联合训练。",
      "componentId": "hero-new"
    }
  },
  "chapters": [
    {
      "kind": "chapter",
      "id": "chap-1",
      "title": "为什么放大后仍看不清？",
      "badge": "inf",
      "badgeLabel": "理解",
      "bridge": "先看清问题：放大像素并不能找回丢失的细节。",
      "analogy": {
        "title": "放大模糊的照片",
        "text": "一张模糊照片被放大后仍缺少边缘细节；放大插值只补像素，不会自动找回真实纹理。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "1.1",
          "title": "拖动先验强度，比较同一低分辨率观测下的两种纹理。",
          "desc": "像素变多不代表信息变多。",
          "componentId": "op-ambiguity"
        }
      ],
      "insight": "图像放大没有消除逆问题的不适定性。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "图像放大没有消除逆问题的不适定性。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "SR 的目标是从先验中选出合理重建，而非保证恢复唯一真值。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "先看清问题：放大像素并不能找回丢失的细节。"
        }
      ]
    },
    {
      "kind": "chapter",
      "id": "chap-2",
      "title": "SRCNN 接收什么样的输入？",
      "badge": "inf",
      "badgeLabel": "理解",
      "bridge": "问题明确后，先把低分辨率亮度图插值到目标尺寸，作为网络输入。",
      "analogy": {
        "title": "对焦照片",
        "text": "镜头对准同一静物，焦点越准边缘越清楚；SRCNN 先将输入插值到目标尺寸。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "2.1",
          "title": "拖动放大倍率，观察插值网格如何变密。",
          "desc": "对齐目标尺寸是卷积映射的输入准备，不是细节恢复本身。",
          "componentId": "op-upscale"
        }
      ],
      "insight": "论文在 Y 通道处理单通道模型，先用双三次插值将输入放大。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "论文在 Y 通道处理单通道模型，先用双三次插值将输入放大。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "论文另扩展到三通道；基础模型讨论不能混同两种设置。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "问题明确后，先把低分辨率亮度图插值到目标尺寸，作为网络输入。"
        }
      ]
    },
    {
      "kind": "chapter",
      "id": "chap-3",
      "title": "为什么要把旧流程合在一起？",
      "badge": "inf",
      "badgeLabel": "理解",
      "bridge": "插值只统一尺寸；接下来要解决传统稀疏编码各步骤分开优化的问题。",
      "analogy": {
        "title": "描摹边缘",
        "text": "铅笔沿着照片中的轮廓描线；单独调字典仍可能让预处理、重建误差留在链路外。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "3.1",
          "title": "拖动切换旧流程与 SRCNN，比较分步设计和联合训练。",
          "desc": "旧方法将预处理、稀疏编码与重建分开处理；SRCNN 把特征提取、映射和重建放入一个可联合优化的网络。",
          "componentId": "op-pipeline"
        }
      ],
      "insight": "§1、§3.2 将传统流程解释为卷积网络的组成部分。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "§1、§3.2 将传统流程解释为卷积网络的组成部分。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "“等价”指可对应的计算形式，不表示传统方法已经联合优化。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "插值只统一尺寸；接下来要解决传统稀疏编码各步骤分开优化的问题。"
        }
      ]
    },
    {
      "kind": "chapter",
      "id": "chap-4",
      "title": "三层网络怎样完成映射？",
      "badge": "both",
      "badgeLabel": "贯通",
      "bridge": "把旧流程的问题转成网络设计：提取特征、映射特征，再重建亮度图。",
      "analogy": {
        "title": "调整相机焦距",
        "text": "镜头依次形成可用特征、变换特征并合成清晰输出；一个整体映射便于联合优化。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "4.1",
          "title": "拖动滑块，逐层查看特征提取、映射和重建。",
          "desc": "滑块位置连续移动，高亮按最近层切换；基准结构依次为 9×9/64、1×1/32、5×5/1。",
          "componentId": "srcnn-explore"
        }
      ],
      "insight": "F(Y)=f(Y;W,b)=f₃(f₂(f₁(Y)))。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "F(Y)=f(Y;W,b)=f₃(f₂(f₁(Y)))。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "论文配置：9×9、1×1、5×5 卷积核；隐藏宽度 64、映射宽度 32。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "把旧流程的问题转成网络设计：提取特征、映射特征，再重建亮度图。"
        }
      ],
      "formula": {
        "lead": "SRCNN 将三层计算复合为从插值图像块到预测亮度块的映射。",
        "unicode": "F(Y)=f₃(f₂(f₁(Y)))",
        "symbols": [
          {
            "sym": "Y",
            "desc": "双三次插值后的低分辨率亮度图像块。"
          },
          {
            "sym": "f₁",
            "desc": "第一层：9×9 卷积提取 64 维特征。"
          },
          {
            "sym": "f₂",
            "desc": "第二层：1×1 卷积将特征映射到 32 维。"
          },
          {
            "sym": "f₃",
            "desc": "第三层：5×5 卷积重建亮度图像块。"
          }
        ]
      }
    },
    {
      "kind": "chapter",
      "id": "chap-5",
      "title": "卷积核能看到多大范围？",
      "badge": "both",
      "badgeLabel": "贯通",
      "bridge": "理解三层职责后，再看每层卷积核如何汇集邻域信息。",
      "analogy": {
        "title": "校准相机",
        "text": "摄影者对准同一场景重复校准；训练对从高分辨率图像经退化构造低分辨率输入。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "5.1",
          "title": "拖动卷积核尺寸，查看它一次覆盖的邻域。",
          "desc": "同一层的核尺寸决定局部感受野；这不同于训练样本覆盖度。",
          "componentId": "op-receptive"
        }
      ],
      "insight": "窗口越大，单层卷积能聚合的局部上下文越多；基准网络三层组合的理论感受野为 13×13。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "窗口越大，单层卷积能聚合的局部上下文越多；基准网络三层组合的理论感受野为 13×13。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "图像数量不是训练图像块数量；论文还采用翻转、旋转等数据增强。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "理解三层职责后，再看每层卷积核如何汇集邻域信息。"
        }
      ]
    },
    {
      "kind": "chapter",
      "id": "chap-6",
      "title": "训练好的网络怎样处理整幅图？",
      "badge": "inf",
      "badgeLabel": "理解",
      "bridge": "局部卷积学会映射后，测试时将同一组权重应用到整幅插值图像。",
      "analogy": {
        "title": "平移取景框",
        "text": "取景框平移时镜头持续对焦同一主体；卷积共享权重逐位置产生预测。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "6.1",
          "title": "拖动卷积位置，查看同一组权重如何扫描图像。",
          "desc": "测试时对插值后的整幅图像逐位置应用卷积；空间位置变化时，卷积参数保持共享。",
          "componentId": "op-inference"
        }
      ],
      "insight": "卷积核在空间位置间共享权重；改变特征通道数会改变表示规模和计算量。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "卷积核在空间位置间共享权重；改变特征通道数会改变表示规模和计算量。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "论文讨论边界处理和不同网络结构的速度质量权衡。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "局部卷积学会映射后，测试时将同一组权重应用到整幅插值图像。"
        }
      ]
    },
    {
      "kind": "chapter",
      "id": "chap-7",
      "title": "网络怎样从错误中学习？",
      "badge": "trn",
      "badgeLabel": "训练",
      "bridge": "整图推理使用已学参数；本章回到训练，看预测误差如何更新参数。",
      "analogy": {
        "title": "调节镜头",
        "text": "镜头焦距向目标清晰度校正；损失下降驱动各层参数共同更新。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "7.1",
          "title": "拖动预测值，观察平方误差如何随偏差变化。",
          "desc": "目标是最小化预测图像与真值图像块的平方误差。",
          "componentId": "op-loss"
        }
      ],
      "insight": "L(Θ)=1/n Σᵢ ||f(Yᵢ;Θ)−Xᵢ||²。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "L(Θ)=1/n Σᵢ ||f(Yᵢ;Θ)−Xᵢ||²。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "该目标按训练样本平均平方误差定义，不等同 PSNR 指标。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "整图推理使用已学参数；本章回到训练，看预测误差如何更新参数。"
        }
      ],
      "formula": {
        "lead": "训练时最小化预测亮度图像块与真实高分辨率图像块之间的平均平方误差。",
        "unicode": "L(Θ)=1/n Σᵢ₌₁ⁿ ||f(Yᵢ;Θ)−Xᵢ||₂²",
        "symbols": [
          {
            "sym": "Θ",
            "desc": "网络各层的卷积权重与偏置。"
          },
          {
            "sym": "n",
            "desc": "训练图像块样本数。"
          },
          {
            "sym": "Yᵢ",
            "desc": "第 i 个插值低分辨率输入块。"
          },
          {
            "sym": "Xᵢ",
            "desc": "与 Yᵢ 对应的高分辨率亮度真值块。"
          },
          {
            "sym": "f",
            "desc": "SRCNN 的三层复合映射。"
          }
        ]
      }
    },
    {
      "kind": "chapter",
      "id": "chap-8",
      "title": "三层各自承担什么职责？",
      "badge": "trn",
      "badgeLabel": "训练",
      "bridge": "回看网络结构，将三层的卷积核、通道数和功能逐一对应。",
      "analogy": {
        "title": "选择对焦区域",
        "text": "摄影者选定一个焦点；学习者点选层，聚焦其特征、映射或重建作用。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "8.1",
          "title": "拖动滑块，查看每层的功能、卷积核和通道数。",
          "desc": "连续拖动滑块；橙色描边按最近层切换。",
          "componentId": "op-architecture"
        }
      ],
      "insight": "特征提取层使用 9×9 卷积核并输出 64 个特征；映射层使用 1×1 卷积并输出 32 个特征；重建层用 5×5 卷积输出一个亮度通道。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "特征提取层使用 9×9 卷积核并输出 64 个特征；映射层使用 1×1 卷积并输出 32 个特征；重建层用 5×5 卷积输出一个亮度通道。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "这是论文报告的一种结构配置；作者还比较了不同滤波器尺寸与特征数的质量、速度折中。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "回看网络结构，将三层的卷积核、通道数和功能逐一对应。"
        }
      ]
    },
    {
      "kind": "chapter",
      "id": "chap-9",
      "title": "论文的基准结果说明了什么？",
      "badge": "trn",
      "badgeLabel": "评测",
      "bridge": "结构与训练过程明确后，再按统一数据集和倍率读取论文结果。",
      "analogy": {
        "title": "检查照片清晰度",
        "text": "摄影者检查同一照片边缘；方法比较必须保持数据集、倍率与指标一致。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "9.1",
          "title": "拖动选择测试集，对比论文报告的 ×3 PSNR。",
          "desc": "论文表 1 的同倍率亮度通道结果；PSNR 越高越好，输入由双三次退化生成。",
          "componentId": "op-results"
        }
      ],
      "insight": "表 1：Set5 ×3 的 SRCNN 为 32.75 dB，A+ 为 32.59 dB；Set14 ×3 为 29.28 dB 对 29.13 dB。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "表 1：Set5 ×3 的 SRCNN 为 32.75 dB，A+ 为 32.59 dB；Set14 ×3 为 29.28 dB 对 29.13 dB。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "该表按合成双三次退化评测，不能直接代表真实相机退化表现。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "结构与训练过程明确后，再按统一数据集和倍率读取论文结果。"
        }
      ]
    },
    {
      "kind": "chapter",
      "id": "chap-10",
      "title": "这些结论适用于哪些图像？",
      "badge": "both",
      "badgeLabel": "贯通",
      "bridge": "最后结合实验退化方式与通道设置，界定结果可以支持的结论。",
      "analogy": {
        "title": "完成照片校准",
        "text": "照片对焦完成，仍需承认焦点受镜头与环境约束；模型表现也受训练设置制约。",
        "componentId": "analogy-canvas"
      },
      "modules": [
        {
          "kind": "module",
          "id": "10.1",
          "title": "拖动查看论文测试设置与未验证场景的区别。",
          "desc": "表 1 的数值来自合成双三次退化测试；不能直接推断真实相机退化下的表现。",
          "componentId": "op-boundary"
        }
      ],
      "insight": "论文报告三通道扩展，并讨论结构与参数设置的折中。",
      "takeaways": [
        {
          "icon": "🔎",
          "title": "核心机制",
          "desc": "论文报告三通道扩展，并讨论结构与参数设置的折中。"
        },
        {
          "icon": "🧩",
          "title": "论文边界",
          "desc": "结果来自论文所列数据集和退化协议，不应外推到任意真实退化。"
        },
        {
          "icon": "📌",
          "title": "记忆锚点",
          "desc": "最后结合实验退化方式与通道设置，界定结果可以支持的结论。"
        }
      ]
    }
  ]
};
