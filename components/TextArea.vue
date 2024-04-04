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
    <div class="mt-3">
        <h2 class="text-sm font-semibold mb-1">{{ label }}</h2>
        <textarea
            required 
            :value="props.modelValue"  
            class="w-[365px] h-[80px] outline outline-1 outline-slate-300 rounded p-2 focus:ring-2 resize-none" 
            name="" 
            id="" 
            cols="30" 
            rows="10"
            @input="$emit('update:modelValue', $event.target.value)"
            >
        </textarea>
    </div>
</template>