<template>
  <div>
    <b-container fluid class="footer-container">
      <b-row class="rowButton">
        <b-col class="colButton">
          <b-button
            variant="secondery"
            class="toggle-footer"
            @click="toggleFooter"
          >
            Creators
          </b-button>
        </b-col>
      </b-row>
      <b-row v-if="isOpen" class="footer-content">
        <b-col>
          <b-card>
            <b-card-text>
              <ul>
                <li><a href="#">Link 1</a></li>
                <li><a href="#">Link 2</a></li>
                <li><a href="#">Link 3</a></li>
              </ul>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleFooter() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        document.querySelector(".footer-container").style.height = "200px"; // Adjust as needed
      } else {
        document.querySelector(".footer-container").style.height = "50px"; // Adjust as needed
      }
    },
  },
};
</script>

<style>
    .footer-container .rowButton .colButton .toggle-footer {
        color: #FAF5EF;
    }
.footer-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #212529;
  border-top: 1px solid #dee2e6;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  height: 50px; /* Initial height */
}

.toggle-footer {
  display: block;
  width: 100%;
  text-align: center;
}

.footer-content {
  overflow: hidden;
}

.footer-content .b-card {
  background-color: #212529;
  border: none;
}

.footer-content ul {
  list-style: none;
  padding: 0;
}

.footer-content li {
  margin: 10px 0;
}

.footer-content a {
  text-decoration: none;
  color: #007bff;
}

.footer-content a:hover {
  text-decoration: underline;
}
</style>
