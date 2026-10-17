<script setup lang="ts">
import { computed, useId } from 'vue'
import { courseFor } from './courses'

const props = defineProps<{ course: string }>()
const info = computed(() => courseFor(props.course))
const uid = useId()

function bud(cx: number, base: number, w: number, h: number) {
  const l = cx - w / 2, r = cx + w / 2
  return `M${l} ${base}V${base - h * .32}Q${l} ${base - h * .78} ${cx} ${base - h}Q${r} ${base - h * .78} ${r} ${base - h * .32}V${base}Z`
}
const towers = [[100, 86, 24, 60], [72, 86, 17, 42], [128, 86, 17, 42], [46, 88, 14, 30], [154, 88, 14, 30]] as const
const tiers = towers.flatMap(([cx, base, w, h]) => [.3, .48, .64].map(t => ({ x1: cx - w * (.5 - t * .28), x2: cx + w * (.5 - t * .28), y: base - h * t })))
const lattice = Array.from({ length: 7 }, (_, row) => Array.from({ length: 5 }, (_, col) => ({ x: 72 + col * 14 + (row % 2) * 7, y: 46 + row * 12 }))).flat()
function star(cx: number, cy: number, s: number) {
  return [`M${cx - s} ${cy - s}H${cx + s}V${cy + s}H${cx - s}Z`, `M${cx} ${cy - s * 1.41}L${cx + s * 1.41} ${cy}L${cx} ${cy + s * 1.41}L${cx - s * 1.41} ${cy}Z`]
}
</script>

<template>
  <figure class="culture-scene" :data-course="info.id">
    <svg viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      <template v-if="info.id === 'levantine'">
        <circle cx="160" cy="34" r="17" fill="#f4bf50" />
        <path d="M0 108C40 94 82 98 122 106C152 112 176 102 200 96V140H0Z" fill="#0b7a56" />
        <g opacity=".75" transform="translate(18 64) scale(.42)">
          <path d="M92 120C94 104 90 96 82 86C89 89 93 93 96 98C98 88 104 80 112 76C108 86 104 96 106 104L110 120Z" fill="#5b4026" />
          <ellipse cx="80" cy="70" rx="24" ry="15" fill="#9cc27e" /><ellipse cx="102" cy="56" rx="28" ry="18" fill="#b2d293" /><ellipse cx="124" cy="68" rx="24" ry="15" fill="#8db872" />
        </g>
        <path d="M0 124C50 112 112 118 200 110V140H0Z" fill="#11935f" />
        <path d="M96 128C99 110 92 100 82 88C90 91 95 96 99 102C101 90 108 80 118 74C113 86 108 98 110 108C111 116 113 122 116 128Z" fill="#6b4a2b" />
        <path d="M100 114C104 108 104 100 101 94" stroke="#4d331d" stroke-width="2" fill="none" stroke-linecap="round" />
        <ellipse cx="76" cy="72" rx="26" ry="16" fill="#8db872" />
        <ellipse cx="102" cy="56" rx="32" ry="20" fill="#a9cc8a" />
        <ellipse cx="130" cy="70" rx="26" ry="16" fill="#8db872" />
        <ellipse cx="90" cy="44" rx="20" ry="12" fill="#bcd9a0" />
        <ellipse cx="118" cy="44" rx="18" ry="11" fill="#b2d293" />
        <g fill="#d9ebc6"><ellipse cx="96" cy="50" rx="7" ry="2.6" transform="rotate(-20 96 50)" /><ellipse cx="124" cy="62" rx="7" ry="2.6" transform="rotate(18 124 62)" /><ellipse cx="72" cy="66" rx="6" ry="2.4" transform="rotate(-12 72 66)" /><ellipse cx="110" cy="38" rx="6" ry="2.2" transform="rotate(10 110 38)" /></g>
        <g fill="#3a2f45"><circle cx="84" cy="62" r="3" /><circle cx="112" cy="66" r="3" /><circle cx="134" cy="74" r="3" /><circle cx="98" cy="40" r="2.6" /><circle cx="66" cy="76" r="2.6" /></g>
        <g fill="#5d7a2e"><circle cx="120" cy="54" r="2.6" /><circle cx="90" cy="70" r="2.6" /></g>
      </template>

      <template v-else-if="info.id === 'khmer'">
        <circle cx="100" cy="62" r="34" fill="#f6c25b" opacity=".9" />
        <rect x="0" y="98" width="200" height="42" fill="#174b91" />
        <g :id="`${uid}-temple`" fill="#fde9c4">
          <path v-for="[cx, base, w, h] in towers" :key="cx" :d="bud(cx, base, w, h)" />
          <rect x="26" y="84" width="148" height="10" rx="1" />
          <rect x="16" y="92" width="168" height="7" rx="1" />
          <path d="M94 84V76H106V84Z" fill="#a51f40" opacity=".55" />
        </g>
        <g stroke="#a51f40" stroke-width="1.4" opacity=".45">
          <line v-for="(l, i) in tiers" :key="i" :x1="l.x1" :x2="l.x2" :y1="l.y" :y2="l.y" />
        </g>
        <g opacity=".3" transform="translate(0 198) scale(1 -1)">
          <use :href="`#${uid}-temple`" />
        </g>
        <g stroke="#fde9c4" stroke-width="1.6" stroke-linecap="round" opacity=".55">
          <line x1="30" y1="110" x2="58" y2="110" /><line x1="120" y1="116" x2="160" y2="116" /><line x1="66" y1="126" x2="104" y2="126" />
        </g>
        <g fill="#5e1023">
          <path d="M183 99C181 86 180 72 182 60" stroke="#5e1023" stroke-width="2.6" fill="none" />
          <circle cx="182" cy="56" r="9" />
          <path d="M182 56L168 50M182 56L196 50M182 56L172 62M182 56L193 63M182 56L182 42" stroke="#5e1023" stroke-width="3" stroke-linecap="round" />
        </g>
      </template>

      <template v-else-if="info.id === 'msa'">
        <defs><clipPath :id="`${uid}-arch`"><path d="M66 132V68Q66 34 100 24Q134 34 134 68V132Z" /></clipPath></defs>
        <path d="M54 136V66Q54 24 100 12Q146 24 146 66V136Z" fill="#936015" opacity=".35" />
        <path d="M66 132V68Q66 34 100 24Q134 34 134 68V132Z" fill="#26352f" />
        <g :clip-path="`url(#${uid}-arch)`" fill="none" stroke="#f4cf75" stroke-width="1.6">
          <g v-for="(p, i) in lattice" :key="i"><path :d="`M${p.x} ${p.y - 6}L${p.x + 6} ${p.y}L${p.x} ${p.y + 6}L${p.x - 6} ${p.y}Z`" /><circle :cx="p.x" :cy="p.y" r="1.6" fill="#f4cf75" /></g>
        </g>
        <path d="M66 132V68Q66 34 100 24Q134 34 134 68V132Z" fill="none" stroke="#fff4d6" stroke-width="3" />
        <path d="M100 6L102.4 11.6L108 12L103.6 15.6L105 21L100 18L95 21L96.4 15.6L92 12L97.6 11.6Z" fill="#fff4d6" />
        <rect x="46" y="130" width="108" height="6" rx="2" fill="#26352f" />
      </template>

      <template v-else-if="info.id === 'quranic'">
        <g fill="none" stroke="#c49b46" stroke-width="2.2" stroke-linejoin="round">
          <path v-for="(d, i) in star(100, 70, 30)" :key="`c${i}`" :d="d" />
          <circle cx="100" cy="70" r="16" />
          <circle cx="100" cy="70" r="49" opacity=".5" />
        </g>
        <g fill="none" stroke="#c49b46" stroke-width="1.6" opacity=".45">
          <path v-for="(d, i) in [...star(30, 34, 12), ...star(170, 34, 12), ...star(30, 106, 12), ...star(170, 106, 12)]" :key="`s${i}`" :d="d" />
        </g>
        <circle cx="100" cy="70" r="5" fill="#c49b46" />
      </template>

      <template v-else>
        <path d="M0 126C60 118 140 118 200 126V140H0Z" fill="#102f5b" />
        <path d="M66 130Q86 98 93 44L97 16H103L107 44Q114 98 134 130H122Q100 102 78 130Z" fill="#fdf6e8" />
        <rect x="80" y="92" width="40" height="5" rx="1" fill="#fdf6e8" />
        <rect x="89" y="60" width="22" height="4" rx="1" fill="#fdf6e8" />
        <path d="M100 16V6" stroke="#fdf6e8" stroke-width="2" />
        <g stroke="#174b91" stroke-width="1.3" opacity=".6"><path d="M84 112L114 98M116 112L86 98M90 86L108 70M110 86L92 70M95 56L104 46M105 56L96 46" /></g>
        <circle cx="40" cy="36" r="12" fill="#f4bf50" opacity=".85" />
      </template>
    </svg>
  </figure>
</template>

<style scoped>
.culture-scene { margin: 0; pointer-events: none; }
.culture-scene svg { display: block; width: 100%; height: auto; }
</style>
