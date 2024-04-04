<script setup>

</script>
<template>
    <div>
        <header>
        <div class="flex bg-[#1D50A2] h-[66px] items-center">
            <div class="pl-[25px] w-[431px]">
                <span class="text-white font-robot text-[16px] font-bold">Frontend Development Challenge #1</span>
            </div>
            <div class="flex justify-end w-full gap-2 pr-[25px]">
                <Icon name="material-symbols:notifications-rounded" size="25" color="white"/>
                <Icon name="ri:account-circle-fill" size="25" color="white"/>
            </div>
        </div>
    </header>
    <div class="container justify-center h-[500px]">
        <slot />
    </div>
    <footer>
        <div class="h-[177px] bg-[#1D50A2] flex items-center justify-center px-[150px]">
            <div class="w-full h-full p-5 flex justify-around">
                <img class="h-[78px]" src="../assets/logo/ECV_logo.png" alt="">
                <div class="flex flex-col">
                    <span class="text-white mb-4">Sitemap</span>
                    <div class="flex flex-col gap-2 text-gray-300 text-sm">
                        
                        <span><a href="">Home</a></span>
                        <span><a href="">About</a></span>
                        <span><a href="">Contact</a></span>
                        
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="text-white mb-4">Socials</span>
                    <div class="flex flex-col gap-2 text-gray-300 text-sm">
                        <span><a href="">Facebook</a></span>
                        <span><a href="">LinkedIn</a></span>
                        <span><a href="">Instagram</a></span>
                        <span><a href="">Twitter</a></span>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="h-[100px]">
                        <span class="text-white">Head Office</span>
                        <div class="flex flex-col gap-2 text-gray-300 text-sm text-justify w-[280px] mt-4">
                            Xilliams Corner Wine © 2017. 1112 A Market St # Ste B22, Charlottesville, CA 45565
                        </div>
                    </div>
                    <div>
                        <span class="text-white">News Letter</span>
                        <div class="mt-2 flex items-center relative">
                            <input class="w-full bg-[#1D50A2] pr-4 py-2 text-white border-b focus:outline-none" type="text" placeholder="Enter your email address">
                            <span class="absolute right-0 flex items-center">
                                <Icon name="ic:round-mail-outline" size="25" color="white"/>
                            </span>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    </div>
</template>