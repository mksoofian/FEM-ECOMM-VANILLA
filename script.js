/////Fetch API: JSON data
fetch('data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (obj) {
    const objData = obj;
    //////////////////////// UPDATE HTML TO USE OBJECT DATA ////////////////////////
    ///////////////------------------ TEXT ZONE ---------------------///////////////
    // Update Brand
    document.querySelector('.brand').innerHTML = objData.company.toUpperCase();
    // Update Item Title (Product Name)
    document.querySelector('.productTitle').innerHTML = objData.productTitle;
    // Update Subtext (Product Description)
    document.querySelector('.subtext').innerHTML = objData.description;
    // Update Price (Product Price)
    document.querySelector('.currPrice').innerHTML =
      objData.currentPrice.toFixed(2);
    // Update Discount (as a percentage)
    document.querySelector('.discountPerc').innerHTML = objData.discountPerc;
    // Update MSRP
    document.querySelector('.msrp').innerHTML = objData.msrp.toFixed(2);
    ///////////////------------------ CART ---------------------///////////////
    // document.querySelector('.itemTitle').innerHTML = objData.productTitle;
    // const currPrice = objData.currentPrice.toFixed(2);

    /////////////////////////////////////////////////////////////////////////////////
    ///// NavBar /////
    ///// Mobile: Nav Bar
    //Selectors
    const primaryNav = document.querySelector('#primary-navigation');
    const primaryNavOverlay = document.querySelector('.menuO');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    //function
    navToggle.addEventListener('click', () => {
      const menuVisibility = primaryNav.getAttribute('data-visible');
      const overlayVisibility = primaryNavOverlay.getAttribute('data-visible');

      if (menuVisibility && overlayVisibility === 'false') {
        primaryNav.setAttribute('data-visible', true);
        primaryNavOverlay.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
      } else if (menuVisibility && overlayVisibility === 'true') {
        primaryNav.setAttribute('data-visible', false);
        primaryNavOverlay.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
      }
    });

    ///// Image Manipulation /////
    ///// Updating Display Image: updates thumbnail image based on what thumbnail has opacity of 0.5
    //Selectors
    const imageZone = document.querySelector('.imageZone');
    const displayedImage = document.querySelector('.display');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const thumbContainer = document.querySelector('.thumbContainer');
    const thumbContainerLB = document.querySelector('.thumbContainerLB');
    const thumbArr = Array.from(thumbnails);
    const lightBoxDisplay = document.querySelector('.lightboxDisplay');
    const prevBtn = document.querySelectorAll('.prev');
    const nextBtn = document.querySelectorAll('.next');

    //Functions
    //////////////// ORIGINAL METHOD - DOESNT WORK NOW DUE TO SCOPE
    // let counter = 0;
    // function updateMainImage(n) {
    //   displayedImage.src = `./images/image-product-3.jpg`;
    //   lightBoxDisplay.src = `./images/image-product-${n + 1}.jpg`;
    // }
    // function prevImage() {
    //   counter -= 1;
    //   if (counter < 0) counter = 3;
    //   updateMainImage(counter);
    // }
    // function nextImage() {
    //   counter += 1;
    //   if (counter > 3) counter = 0;
    //   updateMainImage(counter);
    // }
    ////// SET DISPLAY IMAGE
    let displayImageCounter = 0;
    displayedImage.src = objData.images[0];

    function setDisplayImage(n) {
      displayedImage.src = objData.images[displayImageCounter];
      lightBoxDisplay.src = objData.images[displayImageCounter];
    }
    for (var i = 0; i < prevBtn.length; i++) {
      prevBtn[i].onclick = () => {
        displayImageCounter -= 1;
        displayImageCounter < 0
          ? (displayImageCounter = objData.images.length - 1)
          : displayImageCounter;
        setDisplayImage(displayImageCounter);
      };
      nextBtn[i].onclick = () => {
        displayImageCounter += 1;
        displayImageCounter >= objData.images.length
          ? (displayImageCounter = 0)
          : displayImageCounter;
        setDisplayImage(displayImageCounter);
        console.log(displayImageCounter, objData.images.length);
      };
    }

    ////// INSERT THUMBNAILS INTO HTML (IMAGE ZONE AND LIGHT BOX)
    for (let t = 0; t < objData.thumbnails.length; t++) {
      let thumbHTML = `<div class="thumbInnerContainer">
        			<img
      			  		class="thumbnail thumb${t}"
      			 		src="${objData.thumbnails[t]}"
      			  		alt="product thumbnail - shoe"
      			  		tabindex="0">
        			<div class="thumbUnderlay"></div>`;
      thumbContainer.innerHTML += thumbHTML;
      thumbContainerLB.innerHTML = thumbContainer.innerHTML;
    }

    for (let th = 0; th < objData.thumbnails.length; th++) {
      let tbd = document.querySelectorAll(`.thumb${th}`);
      for (let thnode = 0; thnode < tbd.length; thnode++) {
        tbd[thnode].onclick = () => {
          displayedImage.src = objData.images[th];
          lightBoxDisplay.src = objData.images[th];
        };
      }
    }

    ///// Button Functionality: Input --Qty++ and the Add to Cart button /////
    //Selectors
    const minusBtn = document.querySelector('.minusSymbol');
    const addBtn = document.querySelector('.addSymbol');
    const qtyInput = document.querySelector('.numberInput');
    //Functions
    let qty = 0;
    qtyInput.addEventListener('input', () => {
      qty = Number(qtyInput.value);
      // input minimum = 0
      if (qty < 0) qtyInput.value = 0;
    });
    // minus button functionality
    minusBtn.addEventListener('click', () => {
      qty = Number(qtyInput.value);
      qty -= 1;
      qtyInput.value = qty;
      // input minimum = 0
      if (qty < 0) qtyInput.value = 0;
    });
    // add button functionality
    addBtn.addEventListener('click', () => {
      qty = Number(qtyInput.value);
      qty += 1;
      qtyInput.value = qty;
      // input maximum = 10
      if (qty > 10) qtyInput.value = 10;
    });

    ///// Courasel/ Light Box
    ///// Unhide Light Box (LB) when dbl click display image.
    const lightBox = document.querySelector('.lightBox_container');
    displayedImage.addEventListener('dblclick', () => {
      lightBox.classList.remove('hidden');
    });
    ///// +Hide modal when: 1. ESC key 2. Click X
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightBox.classList.contains('hidden')) {
        lightBox.classList.add('hidden');
      }
    });
    const xBtn = document.querySelector('.exit');
    xBtn.addEventListener('click', () => {
      lightBox.classList.add('hidden');
    });

    ////// --------------  CART  -------------- //////
    ///// Add to Cart Button Functionality
    // Selectors
    const addtoCartBtn = document.querySelector('.addToCartBtn');
    const cartQtyBubble = document.querySelector('.cartQtyBubble');
    const cartIcon = document.querySelector('.cartIcon-nav');
    const cartToggle = document.querySelector('.cart');
    const cartInner = document.querySelector('.cartInner');
    const emptyCart = document.querySelector('.emptyCart');
    const lineItem = document.querySelector('.cartLineItem');
    const lineItemImg = document.querySelector('.lineItemImg');
    const itemTitle = document.querySelector('.itemTitle');
    const checkOutBtn = document.querySelector('.checkOutBtn');
    const cartPricing = document.querySelector('.cartPricing');
    const currPrice = objData.currentPrice.toFixed(2);
    const trashIcon = document.querySelector('.trashIcon');

    // Functions
    let qtyInCart = 0;
    let qtyLineItem = 0;

    // Toggle Show/Hide Cart
    cartIcon.addEventListener('mouseenter', () => {
      let cartVisibility = cartToggle.getAttribute('data-visible');
      if (cartVisibility === 'false') {
        cartToggle.setAttribute('data-visible', 'true');
      } else if (cartVisibility === 'true') {
        cartToggle.setAttribute('data-visible', 'false');
      }
    });
    // cartIcon.addEventListener('mouseleave', () => {
    //   let cartVisibility = cartToggle.getAttribute('data-visible');
    //   if (cartVisibility === 'false') {
    //     cartToggle.setAttribute('data-visible', 'true');
    //   } else if (cartVisibility === 'true') {
    //     cartToggle.setAttribute('data-visible', 'false');
    //   }
    // });

    //Default to Empty Cart
    if (qtyInCart == 0 || qtyInCart == ``) {
      cartQtyBubble.classList.add('hidden');
      emptyCart.textContent = `Your cart is empty.`;
    }
    ////// Line Item Pricing
    const setCartPricing = function (price, quantity) {
      quantityNum = Number(quantity);
      subtotal = currPrice * quantityNum;
      cartPricing.innerHTML = `$${currPrice} x ${quantityNum} <span class='bold'> $${subtotal.toFixed(
        2
      )} </span>`;
    };

    /// Should take the input qty at the time of "click" and update inner HTML of the bubble.
    addtoCartBtn.addEventListener('click', () => {
      qtyInCart += qty;
      qtyLineItem += qty;
      /// If qty > 0, show the bubble : .hidden
      if (qtyInCart > 0) {
        cartQtyBubble.classList.remove('hidden');
        cartQtyBubble.innerHTML = qtyLineItem;
        emptyCart.textContent = ` `;
        lineItem.style.display = 'flex';
        checkOutBtn.style.display = 'block';
        cartInner.style.flexDirection = 'column';
        lineItemImg.style.backgroundImage = `url(${objData.thumbnails[0]})`;
        itemTitle.innerHTML = `${objData.productTitle}`;
      }
      setCartPricing(objData.currPrice, qtyLineItem);
    });
    trashIcon.addEventListener('click', () => {
      qtyLineItem--;
      cartQtyBubble.innerHTML = qtyLineItem;
      setCartPricing(objData.currPrice, qtyLineItem);
      if (qtyLineItem < 1) {
        cartQtyBubble.classList.add('hidden');
        cartQtyBubble.classList.add('hidden');
        emptyCart.textContent = `Your cart is empty.`;
        lineItem.style.display = 'none';
        checkOutBtn.style.display = 'none';
        // cartInner.style.flexDirection = 'column';
        // lineItemImg.style.backgroundImage = `url(${objData.thumbnails[0]})`;
        // itemTitle.innerHTML = `${objData.productTitle}`;
      }
    });

    /////////////////////// END JS
  })
  .catch(function (error) {
    console.error('Something went wrong with retrieving your JSON file!');
    console.error(error);
  });
