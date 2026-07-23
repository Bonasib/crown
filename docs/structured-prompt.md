# Seedance 2.0 结构化提示词手册

## 核心原则

Seedance 2.0（即梦视频生成）对**结构化、英文提示词**响应最佳。提示词质量直接决定视频质量。

---

## 标准结构模板

```
[主体] + [动作/状态], [环境/背景], [光线条件], [镜头语言], [风格/氛围], [质量标签]
```

### 示例（完整）

```
A weathered Chinese warrior in dark armor stands alone on a snow-covered mountain path, 
facing forward with a spear gripped tightly, pine trees heavy with snow on both sides, 
cold moonlight casting long blue shadows, medium shot, static camera, 
ancient Chinese aesthetic, cinematic film grain, hyper-realistic, 8K
```

---

## 各模块详解

### 1. 主体描述（Subject）

描述画面主角的外貌、服饰、神态。应**与素材清单中的角色描述保持一致**。

**模板：**
```
A [age/build] [gender] [role/identity], wearing [clothing details], 
with [distinctive features], [emotional expression]
```

**示例：**
```
A lean Chinese man in his 30s, wearing layered dark blue military robes 
with a bronze chest plate, sharp determined eyes, jaw clenched
```

---

### 2. 动作与状态（Action / State）

描述主体在做什么，或处于什么状态。

| 类型 | 示例词组 |
|------|----------|
| 静态 | `standing still`, `kneeling`, `leaning against` |
| 动态 | `sprinting forward`, `drawing a sword`, `collapsing to the ground` |
| 情绪动作 | `looking down in despair`, `scanning the horizon with alert eyes` |

---

### 3. 环境与背景（Environment）

描述发生地点及背景细节。

**古代中国场景常用词：**
```
snow-covered mountain temple courtyard
dense bamboo forest in mist
a candlelit ancient Chinese prison cell
riverside dock at dusk, wooden boats moored
grand imperial palace corridor with red lacquered pillars
rural inn interior, rough wooden tables and lanterns
```

---

### 4. 光线条件（Lighting）

光线是情绪的核心载体，务必精确描述。

| 情绪 | 光线描述 |
|------|----------|
| 悲壮/压抑 | `overcast cold light, desaturated tones` |
| 紧张/危险 | `dramatic side lighting, deep shadows` |
| 温情/回忆 | `warm golden hour light, soft diffusion` |
| 神秘/鬼魅 | `moonlight, blue-white glow, flickering torch` |
| 暴风雪 | `harsh white diffused light, blowing snow particles` |

---

### 5. 镜头语言（Camera）

**景别**

| 中文 | 英文 | 适用场景 |
|------|------|----------|
| 大远景 | `extreme wide shot (EWS)` | 交代环境、气势 |
| 远景 | `wide shot (WS)` | 人物与环境关系 |
| 全景 | `full shot (FS)` | 完整人物动作 |
| 中景 | `medium shot (MS)` | 对话、互动 |
| 近景 | `medium close-up (MCU)` | 表情、情绪 |
| 特写 | `close-up (CU)` | 细节、道具 |
| 大特写 | `extreme close-up (ECU)` | 眼神、关键道具 |

**镜头运动**

| 中文 | 英文 | 适用场景 |
|------|------|----------|
| 固定 | `static shot` | 对峙、静默 |
| 缓推 | `slow push in` | 压迫感、专注 |
| 拉远 | `slow pull back` | 孤独感、宏观 |
| 左摇 | `pan left` | 跟随动作 |
| 右摇 | `pan right` | 揭示场景 |
| 跟拍 | `tracking shot` | 行走、追逐 |
| 手持 | `handheld, slight shake` | 紧张、混乱 |
| 俯拍 | `bird's eye view` | 宏观、渺小感 |
| 仰拍 | `low angle shot` | 威严、压迫 |
| 环绕 | `360° orbit shot` | 展示、宏大 |
| 升起 | `crane shot rising` | 开场、结尾 |

---

### 6. 风格标签（Style）

```
# 古装写实
ancient Chinese aesthetic, Song Dynasty style, hyper-realistic, cinematic, film grain

# 水墨意境
ink wash painting style, Chinese landscape art, poetic atmosphere, misty

# 动作戏
dynamic action scene, motion blur on weapons, explosive energy

# 情绪特写
shallow depth of field, bokeh background, emotional portraiture
```

---

### 7. 质量标签（Quality Tags）

建议在每个提示词末尾附加：

```
cinematic, 4K, high detail, masterpiece, best quality
```

避免附加（效果负面）：
```
# 不要使用
anime style  （除非你确实需要动漫风格）
cartoon
3D render   （需要写实时避免）
```

---

## 负面提示词（Negative Prompt）

通用负面提示词（适合大多数场景）：

```
low quality, blurry, distorted, deformed faces, extra fingers, missing limbs, 
watermark, text, subtitle, logo, signature, modern clothing, anachronistic elements,
oversaturated, oversharpened, chromatic aberration, noisy, grainy background
```

---

## 分镜提示词示例集

### 示例 A：雪夜行路（动作 + 环境）

```
A lean Chinese man in dark military robes walking through heavy snowstorm, 
leaning into the wind, holding a spear for balance, snow-covered mountain 
road with pine trees, cold moonlight barely visible through storm clouds, 
full shot, slow tracking shot from behind, ancient Chinese aesthetic, 
hyper-realistic, cinematic, 4K
```

### 示例 B：对峙（情绪 + 张力）

```
Two men facing each other in a dimly lit ancient Chinese inn, one gripping 
a sword handle, the other holding a scroll, intense eye contact, candlelight 
casting harsh shadows on their faces, medium shot, static camera, 
dramatic side lighting, deep shadows, film grain, cinematic
```

### 示例 C：火场（动作 + 特效）

```
Massive fire engulfing a traditional Chinese warehouse building at night, 
wooden beams collapsing in sparks and embers, black smoke billowing against 
dark sky, extreme wide shot, static camera, firelight illuminating surrounding 
darkness, cinematic, 4K, hyper-realistic
```

### 示例 D：情绪特写（人物内心）

```
Extreme close-up of a man's eyes filled with tears, reflecting firelight, 
eyelashes catching snowflakes, shallow depth of field, static shot, 
warm flickering light against cold blue background, cinematic portraiture, 
masterpiece quality
```

---

## 常见问题

**Q：提示词多长合适？**
A：50-150 词为佳。过短缺乏细节，过长模型可能忽略部分描述。

**Q：中英文混用是否有效？**
A：Seedance 2.0 对纯英文效果更稳定，建议全用英文。

**Q：如何保持角色一致性？**
A：在每个涉及该角色的提示词中，使用**完全相同的角色描述语句**（从素材清单复制粘贴）。

**Q：生成的视频动作不对怎么办？**
A：在动作描述前加 `cinematic depiction of...` 或具体化动作帧（如 `mid-swing of sword`）。
