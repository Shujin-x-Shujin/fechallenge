<script setup>
const props = defineProps({
    modelValue: {
        type: String
    },
    label: {
        type: String
    }
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
    <div>
        <h2 class="text-sm font-semibold mb-1">{{ label }}</h2>
        <input 
            required
            :value="props.modelValue"
            class="w-[174px] p-[2px] outline outline-1 outline-slate-300 rounded text-sm" 
            type="datetime-local"
            @input="$emit('update:modelValue', $event.target.value)"
        >
    </div>
</template>