<template>
    <div>
      <BContainer>
        <!-- First Row -->
        <BRow class="align-items-center my-5">
          <BCol lg="6">
            <img src="../assets/vue.svg" alt="Image 1" class="img-fluid">
          </BCol>
          <BCol lg="6">
            <h2>Heading for First Row</h2>
            <p>
              This is some text for the first row. You can describe your content here.
              Add more text to make this section informative.
            </p>
          </BCol>
        </BRow>
  
        <!-- Second Row -->
        <BRow class="align-items-center my-5 flex-row-reverse">
          <BCol lg="6">
            <img src="../assets/vue.svg" alt="Image 2" class="img-fluid">
          </BCol>
          <BCol lg="6">
            <h2>Heading for Second Row</h2>
            <p>
              This is some text for the second row. You can describe your content here.
              Add more text to make this section informative.
            </p>
          </BCol>
        </BRow>
      </BContainer>
    </div>
  </template>

<script setup>
import { ref, onMounted } from 'vue'
import { axiosInstance, flaskAxiosInstance } from '../axios-config';
// import axios from '../axios-config'

const data = ref(null)

onMounted(async () => {
    try {
        const response = await axiosInstance.get('http://localhost:8000/boh')
        data.value = response.data
        console.log(data.value);
    } catch (error) {
        console.error(error)
    }
})

defineProps({
  msg: String,
})

const count = ref(0)
</script>


<style scoped>

</style>
