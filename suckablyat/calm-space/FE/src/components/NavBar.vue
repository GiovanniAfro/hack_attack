<template>
    <BNavbar class="bar-parent" toggleable="lg" variant="dark">
        <BNavbarBrand class="where" href="#"><img src="../assets/logoWhite.svg" alt="Logo" class="brand-logo"></BNavbarBrand>
        <BNavbarToggle target="nav-collapse" />
        <BCollapse class="yes" id="nav-collapse" is-nav>
            <BNavbarNav class="fuck" >
                <BNavItem href="#" @click="fetchData" class="element"><p>Home</p></BNavItem>
                <BNavItem href="/about" variant="outline-success" class="element"><p>About</p></BNavItem>
            </BNavbarNav>
            <!-- Right aligned nav items -->
            <BNavbarNav class="ms-auto mb-2 mb-lg-0">
                <BNavItem href="#" class="element"><p>Signup/Login</p></BNavItem>
            </BNavbarNav>
        </BCollapse>
    </BNavbar>
</template>

<script>

import { ref } from 'vue'
import { axiosInstance, flaskAxiosInstance } from '../axios-config';
// import axios from '../axios-config'

export default {
  name: "Navbar",
  setup() {
    const data = ref(null);

    // const fetchData = async () => {
    //     try {
    //     const response = await axios.get('http://localhost:8000/boh')
    //     data.value = response.data
    //     console.log(data.value);
    // } catch (error) {
    //     console.error(error)
    // }
    // };
    const fetchData = async () => {
      try {
        const payload = {
          input: 'your data here'  // Replace with your actual data
        };
        const response = await axiosInstance.post('http://localhost:8000/process-data', payload);
        data.value = response.data;
        console.log(data.value);
      } catch (error) {
        console.error(error);
      }
    };

    return {
      data,
      fetchData,
    };
  },
};
</script>

<!-- For some reason i wasn't able to change the color of the link text and so to fix
it i added a p element inside the parent element and now it works. -->

<style scoped>
    .brand-logo {
        height: 40px; /* Adjust size as needed */
        margin-right: 10px; /* Space between image and text */
    }

    .bar-parent .where .brand-logo {
        width: 250px;
    } 

    .bar-parent #nav-collapse .fuck .element p{
        padding: 0;
        margin: 0;
        color: #FAF5EF !important;
    }

    .bar-parent #nav-collapse .element p{
        padding: 0;
        margin: 0;
        color: #FAF5EF !important;
    }

</style>
