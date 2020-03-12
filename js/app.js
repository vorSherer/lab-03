'use strict'

// Global variables
let arrKeywords = [];


// Constructor function

function Animal(obj){
  this.image_url = obj.image_url;
  this.title = obj.title;
  this.description = obj.description;
  this.keyword = obj.keyword;
  this.horns = obj.horns;
}

Animal.prototype.render = function(){
  let template = Handlebars.compile($('#photo-template').html());
  return template(this);
  // const myTemplate = $('#photo-template').html();
  // // const $newSection = $('<section></section>');
  // const $newSection = $(`<section id=${this.keyword}></section>`);
  // $newSection.html(myTemplate);
  // $newSection.find('h2').text(this.title);
  // $newSection.find('img').attr('src', this.image_url);
  // $newSection.find('p').text(this.description);
  // $('main').append($newSection);
}

Animal.readJson = (page) => {
  Animal.all = [];

  $('main').empty();

  const ajaxSettings = {
    method: 'get',
    dataType: 'json'
  };
  $.ajax(`data/page-${page}.json`, ajaxSettings)
  .then(data => {
    data.forEach(item => {
      Animal.all.push(new Animal(item));
    });
    Animal.sortBy(Animal.all,'title');

    Animal.all.forEach(image => {
      $(`#image-container`).append(image.render());
    });
    Animal.populateFilter();
  });
}

Animal.sortBy = (array, property) => {
  array.sort((a, b) =>
  {
    let firstComparison = a[property];
    let secondComparison = b[property];
    return(firstComparison > secondComparison) ? 1 :
    (firstComparison < secondComparison) ? -1 : 0;
  });
};

Animal.populateFilter = () => {
  let filterKeywords = [];
  $('option').not(':first').remove();
  Animal.all.forEach(image => {
    if (!filterKeywords.includes(image.keyword)) {
      filterKeywords.push(image.keyword);
    }
  });
  filterKeywords.sort();
  filterKeywords.forEach(keyword => {
    let optionTag = `<option value="${keyword}">${keyword}</option>`;
    $('select').append(optionTag);
  });
};

Animal.handleFilter = () => {
  $(`select`).on(`change`, function() {
    let selected = $(this).val();
    if (selected !== 'default') {
      $('div').hide();
      $(`div.${selected}`).fadeIn();
    }
  });
};


Animal.handleSort = () => {
  $('input').on('change', function () {
    $('select').val('default');
    $('div').remove();
    Animal.sortBy(Animal.all, $(this).attr('id'));
    Animal.all.forEach(image => {
      $('image-container').append(image.render());
    } );
  });
};



Animal.handleImagesEvents = () => {
  $('main').on('click', 'div', function(event) {
    event.stopPropagation();
    let $clone = $(this).clone();
    let elements = $clone[0].children;

    $('section').addClass('active').html(elements);
    $(window).scrollTop(0);
  });

  $('body').on('click', function() {
    const $section = $('section');
    $section.empty();
    $section.removeClass('active');
  });
}


Animal.handleNavEvents = () => {
  $('footer ul, header ul').on('click', 'li', function () {
    $('#image-container').empty();
    Animal.readJson($(this).attr('id'));
  });
};

$(() => {
  Animal.readJson(1);
  Animal.handleFilter();
  Animal.handleImagesEvents();
  Animal.handleNavEvents();
  Animal.handleSort()
});


///////////

// imageClone.attr('class', this.keyword);

function populateArrKeywords(keyword) {
  if( !arrKeywords.includes(keyword) ) {
    arrKeywords.push(keyword);
  }
}


function loadAnimalsPageOne(){
  $.ajax('data/page-1.json', {method:'GET', dataType: 'JSON'})
    .then( eleObj => {
      eleObj.forEach(element => {
        (new Animal(element).render());
        populateArrKeywords(element.keyword);
      });
      populateDropbox();
    })
}

function loadAnimalsPageTwo(){
  console.log('in page2 now');
  // $().ready(() => {
  $.ajax('data/page-2.json', {method:'GET', dataType: 'JSON'})
    .then( eleObj => {
      console.log('in ajax part');
      eleObj.forEach(element => {
        (new Animal(element).render());
        populateArrKeywords(element.keyword);
      });
      populateDropbox();
    })
  // });
}

function populateDropbox() {
  arrKeywords.forEach(key => {
    let $option = $(`<option class="${key}">${key}</option>`);
    $('#list').append($option);
  });
}

// Event listener

$(() => {
  $('select').on('change', function() {
    // console.log(this.value);
    if (this.value === 'all') {
      $('section').show();
      $('#photo-template').hide();
    } else if (this.value !== 'default') {
      $('section').hide();
      $(`section[id="${this.value}"]`).show();
    }
  });
});


// listener bottom two
$(() => {
  $('#btnPageTwo').on('click', function() {
   
    // if (this.value === 'all') {
    //   $('section').show();
  //  $('#photo-template').hide();
    // } else if (this.value !== 'default') {
      // $('section').hide();
      loadAnimalsPageTwo();
      // $('section').show();
    //   $(`section[id="${this.value}"]`).show();
    // }
  });
});


// retrieve the data from the file, but until is loaded
$().ready(() => {
  console.log ('Page loaded');
  loadAnimalsPageOne();
});