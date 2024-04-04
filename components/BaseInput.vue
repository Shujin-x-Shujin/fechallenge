<script setup>
 const props = defineProps({
    modelValue: {
        type: String,
        defualt: ''
    },
    label : {
        type: String
    }
 })
const emit = defineEmits(['update:modelValue'])

</script>
<template>
    <div>
        <h2 class="text-sm font-semibold mb-1">{{ label }}</h2>
        <input 
            class="w-[365px] h-[30px] outline outline-1 outline-slate-300 rounded p-2 focus:ring-2"
            required
            v-bind="$attrs"
            :value="props.modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        >
    </div>
</template>