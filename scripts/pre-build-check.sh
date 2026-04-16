#!/bin/bash
# QNClawdian Pre-Build DoubleCheck
# 每次构建前自动运行，防止低级错误上线
# By Q & N

set -e
ERRORS=0
WARNINGS=0
SRC_DIR="src"

echo "🔍 QNClawdian Pre-Build DoubleCheck"
echo "=================================="

# 1. 语法检查（TypeScript）
echo ""
echo "📋 1. TypeScript 类型检查"
if npx tsc --noEmit 2>/dev/null; then
  echo "   ✅ 零类型错误"
else
  echo "   ❌ 有类型错误！"
  ERRORS=$((ERRORS+1))
fi

# 2. 模型名一致性
echo ""
echo "📋 2. 模型名一致性"
if grep -r "gemma4:27b" $SRC_DIR/ 2>/dev/null; then
  echo "   ❌ 发现旧模型名 gemma4:27b！应该是 gemma4:26b"
  ERRORS=$((ERRORS+1))
else
  echo "   ✅ 无旧模型名残留"
fi

# 3. 多余的花括号/分号检查（常见手动编辑错误）
echo ""
echo "📋 3. 代码结构检查"
for f in $(find $SRC_DIR -name "*.ts"); do
  # 检查花括号配对
  open=$(grep -o '{' "$f" | wc -l)
  close=$(grep -o '}' "$f" | wc -l)
  if [ "$open" != "$close" ]; then
    echo "   ❌ $f: 花括号不配对 (open=$open close=$close)"
    ERRORS=$((ERRORS+1))
  fi
done
if [ $ERRORS -eq 0 ]; then
  echo "   ✅ 花括号配对正确"
fi

# 4. manifest.json 检查
echo ""
echo "📋 4. manifest.json"
if python3 -c "
import json
d=json.load(open('manifest.json'))
assert d['id'] == 'qnclawdian', f'id错误: {d[\"id\"]}'
assert d['author'] == 'Q & N', f'author错误: {d[\"author\"]}'
assert 'version' in d, '缺少version'
print(f'   ✅ {d[\"name\"]} v{d[\"version\"]} by {d[\"author\"]}')
" 2>/dev/null; then
  :
else
  echo "   ❌ manifest.json 有问题"
  ERRORS=$((ERRORS+1))
fi

# 5. 默认设置检查
echo ""
echo "📋 5. 默认设置检查"
DEFAULT_MODEL=$(grep "model:" $SRC_DIR/main.ts | head -1 | grep -oE "gemma4:[0-9]+b")
MODELS_LIST=$(grep "value:" $SRC_DIR/settings/models.ts | grep -oE "'[^']+'" | tr -d "'")
if echo "$MODELS_LIST" | grep -q "$DEFAULT_MODEL"; then
  echo "   ✅ 默认模型 $DEFAULT_MODEL 在模型列表中"
else
  echo "   ❌ 默认模型 $DEFAULT_MODEL 不在模型列表中！"
  ERRORS=$((ERRORS+1))
fi

# 6. i18n 完整性
echo ""
echo "📋 6. i18n 完整性"
if [ -f "$SRC_DIR/i18n/index.ts" ]; then
  for lang in "en" "zh" "ja" "ko"; do
    if grep -q "const $lang:" "$SRC_DIR/i18n/index.ts"; then
      echo "   ✅ $lang 语言包存在"
    else
      echo "   ⚠️ $lang 语言包缺失"
      WARNINGS=$((WARNINGS+1))
    fi
  done
else
  echo "   ⚠️ i18n 文件不存在"
  WARNINGS=$((WARNINGS+1))
fi

# 7. 硬编码 URL 检查
echo ""
echo "📋 7. 硬编码检查"
HARDCODED=$(grep -rn "localhost" $SRC_DIR/ --include="*.ts" | grep -v "DEFAULT_SETTINGS\|default\|placeholder\|comment\|//" | head -5)
if [ -n "$HARDCODED" ]; then
  echo "   ⚠️ 发现可能的硬编码 URL:"
  echo "$HARDCODED" | while read line; do echo "      $line"; done
  WARNINGS=$((WARNINGS+1))
else
  echo "   ✅ 无硬编码 URL"
fi

# 汇总
echo ""
echo "=================================="
if [ $ERRORS -gt 0 ]; then
  echo "❌ 检查失败: $ERRORS 个错误, $WARNINGS 个警告"
  echo "   请修复后再构建！"
  exit 1
else
  echo "✅ 检查通过: 0 个错误, $WARNINGS 个警告"
  echo "   可以构建！"
  exit 0
fi
