jQuery(document).ready(function ($) {
  $(window).on("load", function () {
    $(".pfr-preloader").delay(400).fadeOut("slow");
  });
  $(".mobile-menu-btn").on("click", function () {
    $("#mobile-flyout-menu").removeClass("hidden");
    setTimeout(function () {
      $("#flyout-panel").removeClass("-translate-x-full");
    }, 10);
  });

  $("#close-flyout, #mobile-flyout-menu").on("click", function (e) {
    if (
      e.target.id === "mobile-flyout-menu" ||
      $(e.target).closest("#close-flyout").length
    ) {
      $("#flyout-panel").addClass("-translate-x-full");
      setTimeout(function () {
        $("#mobile-flyout-menu").addClass("hidden");
      }, 300);
    }
  });

  $("#flyout-panel").on("click", function (e) {
    e.stopPropagation();
  });
  $("#flyout-panel").on("click", "a", function (e) {
    console.log("Link clicked:", $(this).attr("href"));
  });

  // Handle button clicks for submenu toggles
  $("#flyout-panel").on("click", "button, span", function (e) {
    var $element = $(this);
    var $li = $element.closest("li.toggle-submenu");
    var target = $li.data("target");

    if (target && $li.length) {
      e.preventDefault();
      e.stopPropagation();

      var $arrow = $li.find("button svg").first();
      var $submenu = $("#" + target);
      var isCurrentlyOpen = $submenu.is(":visible");
      // Close other open submenus
      $li.siblings("li[data-target]").each(function () {
        var siblingTarget = $(this).data("target");
        if (siblingTarget) {
          $("#" + siblingTarget).slideUp(200);
          $(this).find("button svg").first().removeClass("rotate-180");
        }
      });

      // Toggle current submenu
      if (isCurrentlyOpen) {
        $submenu.slideUp(200);
        $arrow.removeClass("rotate-180");
      } else {
        $submenu.slideDown(200);
        $arrow.addClass("rotate-180");
      }
    }
  });

  // Toggle submenu visibility Ends

  // Testimonial Slider Starts
  if (window.$ && $(".testimonial-slider").length) {
    $(".testimonial-slider").slick({
      arrows: true,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow:
        '<svg class="w-12 h-12 lg:w-16 lg:h-16 absolute left-[calc(50%-80px)] lg:left-0 top-full lg:top-[calc(50%-60px)] text-white cursor-pointer" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 48 48"><line x1="32" y1="8" x2="16" y2="24" /><line x1="16" y1="24" x2="32" y2="40" /></svg>',
      nextArrow:
        '<svg class="w-12 h-12 lg:w-16 lg:h-16 absolute right-[calc(50%-80px)] lg:right-0 top-full lg:top-[calc(50%-60px)] text-white cursor-pointer " fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 48 48"><line x1="16" y1="8" x2="32" y2="24" /><line x1="32" y1="24" x2="16" y2="40" /></svg>',
      adaptiveHeight: true,
    });
  }

  if (window.$ && $(".gift-card__images").length) {
    $(".gift-card__images").slick({
      dots: true,
    });
  }

  // Tab switching
  $(".faq-tab-btn").on("click", function () {
    var tabIdx = $(this).data("tab");
    $(".faq-tab-btn")
      .removeClass("bg-brandPrimary text-white active")
      .addClass("bg-gray-100 text-gray-700");
    $(this)
      .addClass("bg-brandPrimary text-white active")
      .removeClass("bg-gray-100 text-gray-700");
    $(".faq-tab-content").addClass("hidden");
    $('.faq-tab-content[data-tab-content="' + tabIdx + '"]').removeClass(
      "hidden",
    );
  });
  // FAQ accordion
  $(".faq-question").on("click", function () {
    var $answer = $(this).closest(".border-b").find(".faq-answer");
    $answer.toggleClass("hidden");
    $(this).find("svg").toggleClass("rotate-180");
  });

  // Info Tab
  const $tabLinks = $(".tab-link");
  const $tabContents = $(".tabs-content");
  const $certificateImages = $(".certificate-img");

  $tabLinks.on("click", function (e) {
    e.preventDefault();
    const targetTab = $(this).data("tab");

    $tabLinks
      .removeClass("border border-brandPrimary bg-gray-100")
      .addClass("bg-white text-gray-800");

    $(this)
      .addClass("border border-brandPrimary  bg-gray-100")
      .removeClass("bg-white text-gray-800");

    $tabContents.addClass("hidden");

    $("#tabs-" + targetTab).removeClass("hidden");
    $certificateImages.addClass("hidden");

    $certificateImages
      .filter('[data-tab="' + targetTab + '"]')
      .removeClass("hidden");
  });

  // Load JSON data
  let storeData = [];
  try {
    var storeDataEl = document.getElementById("store-locator-data");
    if (
      storeDataEl &&
      storeDataEl.textContent &&
      storeDataEl.textContent.trim() !== ""
    ) {
      var parsed = JSON.parse(storeDataEl.textContent);
      // Defensive extraction in case structure differs
      storeData =
        Array.isArray(parsed) && parsed[0] && parsed[0].store_data
          ? parsed[0].store_data
          : [];
      console.log("Store Data:", storeData);
      console.log("Loaded", storeData.length, "stores");
    } else {
      console.warn(
        "No #store-locator-data element or empty content — using empty storeData",
      );
      storeData = [];
    }
  } catch (error) {
    console.error("Error loading store data:", error);
    storeData = [];
  }

  // Initialize DataTable

  const table = $("#stores-table").DataTable({
    data: storeData,
    pageLength: 100,
    lengthMenu: [
      [25, 50, 100, 200, -1],
      [25, 50, 100, 200, "All"],
    ],
    order: [
      [0, "asc"],
      [1, "asc"],
    ], // Sort by state, then store name
    columns: [
      {
        data: "state",
        title: "State",
        width: "20%",
        render: function (data) {
          return data || '<span class="text-gray-400 italic">No State</span>';
        },
      },
      {
        data: "store",
        title: "Store Name",
        width: "80%",
        render: function (data) {
          return (
            data || '<span class="text-gray-400 italic">No Store Name</span>'
          );
        },
      },
    ],
    responsive: true,
    searching: true,
    language: {
      search: "Search all stores:",
      lengthMenu: "Show _MENU_ stores per page",
      info: "Showing _START_ to _END_ of _TOTAL_ stores",
      infoEmpty: "No stores found",
      infoFiltered: "(filtered from _MAX_ total stores)",
      zeroRecords: "No stores match your search criteria",
      emptyTable: "No store data available",
    },
    dom: '<"flex flex-col p-2 lg:flex-row lg:justify-between lg:items-center mb-4"<"mb-2 lg:mb-0"l><"mb-2 lg:mb-0"f>>rtip',
    initComplete: function () {
      // Add a small delay to ensure DataTables is fully initialized
      setTimeout(function () {
        updateStoreCount();
        // Style the DataTables elements with Tailwind
        styleDataTableElements();
      }, 100);
    },
  });

  // Initial store count update (fallback)
  if (storeData.length > 0) {
    $("#data-info span:last-child").text(`${storeData.length} stores`);
  }

  // State filter functionality
  $("#state-filter").on("change", function () {
    const selectedState = $(this).val();

    if (selectedState === "") {
      table.columns(0).search("").draw();
    } else {
      table
        .columns(0)
        .search("^" + selectedState + "$", true, false)
        .draw();
    }

    updateStoreCount();
    updateMapHighlight(selectedState);
  });

  // Clear filters
  $("#clear-filters").on("click", function () {
    $("#state-filter").val("");
    table.search("").columns().search("").draw();
    updateStoreCount();
    updateMapHighlight("");
  });

  // Update store count display
  function updateStoreCount() {
    try {
      const info = table.page.info();
      const filteredCount = info.recordsDisplay;
      const totalCount = info.recordsTotal;

      let countText = `${totalCount} stores`;
      if (filteredCount !== totalCount) {
        countText = `${filteredCount} of ${totalCount} stores`;
      }

      $("#data-info span:last-child").text(countText);
    } catch (error) {
      console.error("Error updating store count:", error);
      $("#data-info span:last-child").text("Error loading count");
    }
  }

  // Update table info when search/filter changes
  table.on("draw", function () {
    updateStoreCount();
  });

  // Map highlighting function (if you have a map)
  function updateMapHighlight(stateId) {
    // Reset all map elements
    $("path, rect").css("fill", "#fff");

    if (stateId) {
      // Highlight selected state
      $(".sm_" + stateId + ", .sm_state_" + stateId).css("fill", "#ed2129");
    }
  }

  // Global filter function for external use (e.g., map clicks)
  window.filterGlobal = function (stateCode) {
    $("#state-filter").val(stateCode).trigger("change");

    // Scroll to table
    $("html, body").animate(
      {
        scrollTop: $("#stores-table").offset().top - 100,
      },
      500,
    );
  };

  // Style DataTables elements with Tailwind classes
  function styleDataTableElements() {
    $(".dataTables_filter input").addClass(
      "ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    );
    $(".dataTables_filter label").addClass("text-sm font-medium text-gray-700");

    $(".dataTables_length select").addClass(
      "ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    );
    $(".dataTables_length label").addClass("text-sm font-medium text-gray-700");

    $(".dataTables_paginate .paginate_button").addClass(
      "px-3 py-2 ml-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700",
    );
    $(".dataTables_paginate .paginate_button.current").addClass(
      "bg-blue-500 text-white border-blue-500 hover:bg-blue-600",
    );
    $(".dataTables_paginate .paginate_button.disabled").addClass(
      "text-gray-300 cursor-not-allowed hover:bg-white hover:text-gray-300",
    );

    // Style info text
    $(".dataTables_info").addClass("text-sm text-gray-700");

    // Style table rows
    $("#stores-table tbody tr").addClass("hover:bg-gray-50");
    $("#stores-table tbody td").addClass(
      "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
    );
  }

  jQuery("svg a").click(function (e) {
    e.preventDefault();
  });

  // Legacy function for backward compatibility
  window.scrollToAnchor = function (aid) {
    const target = $(`p[name='${aid}']`);
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top,
        },
        500,
      );
    }
  };

  // Login Page Handling
  // function showLogin() {
  //   var login = document.querySelector(".login-view");
  //   var recover = document.querySelector(".recover-view");
  //   if (login) login.classList.remove("hidden");
  //   if (recover) recover.classList.add("hidden");
  //   var f =
  //     login &&
  //     login.querySelector('input[name="customer[email]"], input[type="email"]');
  //   if (f) f.focus();
  // }

  // function showRecover() {
  //   var login = document.querySelector(".login-view");
  //   var recover = document.querySelector(".recover-view");
  //   if (login) login.classList.add("hidden");
  //   if (recover) recover.classList.remove("hidden");
  //   var f =
  //     recover &&
  //     recover.querySelector('input[name="email"], input[type="email"]');
  //   if (f) f.focus();
  // }

  // function bindHandlers() {
  //   var forgot = document.getElementById("forgot-password-btn");
  //   var back = document.getElementById("back-to-login-btn");

  //   if (window.jQuery) {
  //     (function ($) {
  //       $(function () {
  //         if (forgot)
  //           $(forgot).on("click", function (e) {
  //             e.preventDefault();
  //             showRecover();
  //           });
  //         if (back)
  //           $(back).on("click", function (e) {
  //             e.preventDefault();
  //             showLogin();
  //           });

  //         if (window.__pf_show_recover) showRecover();
  //         else if (window.__pf_show_login) showLogin();
  //       });
  //     })(jQuery);
  //   } else {
  //     if (forgot)
  //       forgot.addEventListener("click", function (e) {
  //         e.preventDefault();
  //         showRecover();
  //       });
  //     if (back)
  //       back.addEventListener("click", function (e) {
  //         e.preventDefault();
  //         showLogin();
  //       });

  //     if (window.__pf_show_recover) showRecover();
  //     else if (window.__pf_show_login) showLogin();
  //   }
  // }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindHandlers);
  } else {
    bindHandlers();
  }

  // Order Handelling
  function populateProvince(select) {
    var selectedCountryOption = null;
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === select.getAttribute("value")) {
        selectedCountryOption = select.options[i];
        selectedCountryOption.setAttribute("selected", "selected");
        break;
      }
    }
    if (!selectedCountryOption)
      selectedCountryOption = select.options[select.selectedIndex];

    if (!selectedCountryOption) return;

    try {
      var provincesData =
        selectedCountryOption.dataset.provinces ||
        selectedCountryOption.getAttribute("data-provinces") ||
        "[]";
      var provinces = JSON.parse(provincesData);
    } catch (e) {
      var provinces = [];
    }

    var id = select.dataset.id;
    var provinceSelector = document.querySelector("#address_province_" + id);
    if (!provinceSelector) return;

    if (!provinces || provinces.length === 0) {
      provinceSelector.setAttribute("disabled", "disabled");
      provinceSelector.innerHTML = "";
      return;
    }

    provinceSelector.removeAttribute("disabled");
    var options = "";
    for (var j = 0; j < provinces.length; j++) {
      var value = provinces[j][0];
      var label = provinces[j][0];
      var selected = "";
      if (provinceSelector.getAttribute("value") === value)
        selected = " selected";
      options +=
        '<option value="' + value + '"' + selected + ">" + label + "</option>";
    }
    provinceSelector.innerHTML = options;
  }

  function initCountryProvince() {
    var all = document.querySelectorAll("select[data-country-selector]");
    if (!all || all.length === 0) return;
    for (var i = 0; i < all.length; i++) {
      populateProvince(all[i]);
      (function (sel) {
        sel.addEventListener("change", function () {
          populateProvince(this);
        });
      })(all[i]);
    }
  }

  function bindUI() {
    var newBtn = document.getElementById("new-address-btn");
    var newModal = document.getElementById("new-address-modal");
    var closeNew = document.getElementById("close-new-address");
    var cancelNew = document.getElementById("cancel-new-address");

    function open(el) {
      if (el) el.classList.remove("hidden");
    }
    function close(el) {
      if (el) el.classList.add("hidden");
    }

    if (newBtn)
      newBtn.addEventListener("click", function () {
        open(newModal);
      });
    if (closeNew)
      closeNew.addEventListener("click", function () {
        close(newModal);
      });
    if (cancelNew)
      cancelNew.addEventListener("click", function () {
        close(newModal);
      });

    // edit buttons
    var editBtns = document.querySelectorAll(".edit-address-btn");
    editBtns.forEach(function (btn) {
      var id = btn.dataset.addressId;
      btn.addEventListener("click", function () {
        var modal = document.getElementById("edit-address-" + id);
        if (modal) modal.classList.remove("hidden");
        // populate provinces for this modal (in case)
        var countrySelect = document.querySelector("#address_country_" + id);
        if (countrySelect) populateProvince(countrySelect);
      });
    });

    // close edit modals
    var closeEditBtns = document.querySelectorAll(".close-edit-address");
    closeEditBtns.forEach(function (btn) {
      var id = btn.dataset.addressId;
      btn.addEventListener("click", function () {
        var modal = document.getElementById("edit-address-" + id);
        if (modal) modal.classList.add("hidden");
      });
    });

    // delete buttons
    var deleteBtns = document.querySelectorAll(".delete-address-btn");
    deleteBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var url = this.dataset.url;
        if (confirm("Do you really wish to delete this address?")) {
          // submit the hidden form next to the card
          var form = this.parentElement.querySelector(
            "form.delete-address-form",
          );
          if (form) {
            form.action = url;
            form.submit();
          } else {
            // fallback find by action
            var f = document.querySelector('form[action="' + url + '"]');
            if (f) f.submit();
          }
        }
      });
    });
  }

  // prefer jQuery ready if available
  if (window.jQuery) {
    (function ($) {
      $(function () {
        initCountryProvince();
        bindUI();
      });
    })(jQuery);
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        initCountryProvince();
        bindUI();
      });
    } else {
      initCountryProvince();
      bindUI();
    }
  }
});
