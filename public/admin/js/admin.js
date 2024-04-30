(function ($) {
	'use strict';
	/*--
    Commons Variables
-----------------------------------*/
	let $window = $(window);
	let $body = $('body');
	/*--
    Adomx Dropdown (Custom Dropdown)
-----------------------------------*/
	if ($('.adomx-dropdown').length) {
		let $adomxDropdown = $('.adomx-dropdown'),
			$adomxDropdownMenu = $adomxDropdown.find('.adomx-dropdown-menu');

		$adomxDropdown.on('click', '.toggle', function (e) {
			e.preventDefault();
			let $this = $(this);
			if (!$this.parent().hasClass('show')) {
				$adomxDropdown.removeClass('show');
				$adomxDropdownMenu.removeClass('show');
				$this.siblings('.adomx-dropdown-menu').addClass('show').parent().addClass('show');
			} else {
				$this.siblings('.adomx-dropdown-menu').removeClass('show').parent().removeClass('show');
			}
		});
		/*Close When Click Outside*/
		$body.on('click', function (e) {
			let $target = e.target;
			if (
				!$($target).is('.adomx-dropdown') &&
				!$($target).parents().is('.adomx-dropdown') &&
				$adomxDropdown.hasClass('show')
			) {
				$adomxDropdown.removeClass('show');
				$adomxDropdownMenu.removeClass('show');
			}
		});
	}

	/*--
    Header Search Open/Close
-----------------------------------*/
	let $headerSearchOpen = $('.header-search-open'),
		$headerSearchClose = $('.header-search-close'),
		$headerSearchForm = $('.header-search-form');
	$headerSearchOpen.on('click', function () {
		$headerSearchForm.addClass('show');
	});
	$headerSearchClose.on('click', function () {
		$headerSearchForm.removeClass('show');
	});

	/*--
    Side Header
-----------------------------------*/
	let $sideHeaderToggle = $('.side-header-toggle'),
		$sideHeaderClose = $('.side-header-close'),
		$sideHeader = $('.side-header');

	/*Add/Remove Show/Hide Class On Depending on Viewport Width*/
	function $sideHeaderClassToggle() {
		let $windowWidth = $window.width();
		if ($windowWidth >= 1200) {
			$sideHeader.removeClass('hide').addClass('show');
		} else {
			$sideHeader.removeClass('show').addClass('hide');
		}
	}
	$sideHeaderClassToggle();
	/*Side Header Toggle*/
	$sideHeaderToggle.on('click', function () {
		if ($sideHeader.hasClass('show')) {
			$sideHeader.removeClass('show').addClass('hide');
		} else {
			$sideHeader.removeClass('hide').addClass('show');
		}
	});
	/*Side Header Close (Visiable Only On Mobile)*/
	$sideHeaderClose.on('click', function () {
		$sideHeader.removeClass('show').addClass('hide');
	});

	/*--
    Side Header Menu
-----------------------------------*/
	let $sideHeaderNav = $('.side-header-menu'),
		$sideHeaderSubMenu = $sideHeaderNav.find('.side-header-sub-menu');

	/*Add Toggle Button in Off Canvas Sub Menu*/
	$sideHeaderSubMenu.siblings('a').append('<span class="menu-expand"><i class="zmdi zmdi-chevron-down"></i></span>');

	/*Close Off Canvas Sub Menu*/
	$sideHeaderSubMenu.slideUp();

	/*Category Sub Menu Toggle*/
	$sideHeaderNav.on('click', 'li a, li .menu-expand', function (e) {
		let $this = $(this);
		if ($this.parent('li').hasClass('has-sub-menu') || $this.attr('href') === '#' || $this.hasClass('menu-expand')) {
			e.preventDefault();
			if ($this.siblings('ul:visible').length) {
				$this
					.parent('li')
					.removeClass('active')
					.children('ul')
					.slideUp()
					.siblings('a')
					.find('.menu-expand i')
					.removeClass('zmdi-chevron-up')
					.addClass('zmdi-chevron-down');
				$this
					.parent('li')
					.siblings('li')
					.removeClass('active')
					.find('ul:visible')
					.slideUp()
					.siblings('a')
					.find('.menu-expand i')
					.removeClass('zmdi-chevron-up')
					.addClass('zmdi-chevron-down');
			} else {
				$this
					.parent('li')
					.addClass('active')
					.children('ul')
					.slideDown()
					.siblings('a')
					.find('.menu-expand i')
					.removeClass('zmdi-chevron-down')
					.addClass('zmdi-chevron-up');
				$this
					.parent('li')
					.siblings('li')
					.removeClass('active')
					.find('ul:visible')
					.slideUp()
					.siblings('a')
					.find('.menu-expand i')
					.removeClass('zmdi-chevron-up')
					.addClass('zmdi-chevron-down');
			}
		}
	});

	$window.on('load', function () {
		let theme = localStorage.getItem('admin-theme') ?? null;
		if (theme == 'dark') document.body.classList.add('skin-dark');
		else document.body.classList.remove('skin-dark');
		// dark mode
		const toggleDARK = document.querySelector('.toggle-dark');
		toggleDARK.addEventListener('click', function () {
			if (document.body.classList.contains('skin-dark')) {
				localStorage.setItem('admin-theme', 'light');
				document.body.classList.remove('skin-dark');
				this.firstElementChild.src = '/static/admin/images/moon.svg';
				$body.removeClass(function (index, className) {
					return (className.match(/\bheader-top-\S+/g) || []).join(' ');
				});
				$body.removeClass(function (index, className) {
					return (className.match(/\bside-header-\S+/g) || []).join(' ');
				});
			} else {
				localStorage.setItem('admin-theme', 'dark');
				document.body.classList.add('skin-dark');
				this.firstElementChild.src = '/static/admin/images/sun.svg';
			}
		});
		// close button messages functionality
		const closeButton = document.querySelector('.btn-close');
		if (closeButton != null) {
			// modal close button
			closeButton.addEventListener('click', e => {
				let parent = e.target.parentElement;
				parent.remove();
			});
		}
	});
	// image size validation for every file input that uploads a photo
	const UploadImageInput = document.querySelector('.uploadImageInput');
	UploadImageInput.onchange = function () {
		if (this.files[0].size > 1e6) {
			alert('عکس اپلود شده باید کم تر از 1 مگابایت باشد');
			this.value = '';
		}
	};
	// eslint-disable-next-line no-undef
})(jQuery);
