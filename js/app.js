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
  // step1$2 w handlebars: grab the template script AND then complie it
  let template = Handlebars.compile($('#photo-template').html());
  return template(this);
}

Animal.readJson = (page) => {
  console.log('Now in readJson page: ' + page);
  Animal.all = [];//all the instances of the Animal object

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
      // sort the titl, to the render can be organiced
      Animal.sortBy(Animal.all,'title');

      Animal.renderAll();
      Animal.populateFilter();
    });
}

Animal.renderAll = () => {
  Animal.all.forEach(image => {
    // step4: add the compiled json to the page
    $(`#image-container`).append(image.render());
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
 
    Animal.renderAll();
    //here the images need to be displayed
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


// MAIN
$(() => {
  console.log('Now in Main');
  Animal.readJson(1);
  Animal.handleFilter();
  // Animal.handleImagesEvents(); //makes clones. is working
  Animal.handleNavEvents();
  Animal.handleSort()
});



// function populateArrKeywords(keyword) {
//   if( !arrKeywords.includes(keyword) ) {
//     arrKeywords.push(keyword);
//   }
// }


// function loadAnimalsPageOne(){
//   $.ajax('data/page-1.json', {method:'GET', dataType: 'JSON'})
//     .then( objAlax => {
//       objAlax.forEach(animalInAjax => {
//         (new Animal(animalInAjax).render());
//         populateArrKeywords(animalInAjax.keyword);
//       });
//       populateDropbox();
//     })
// }

// function loadAnimalsPageTwo(){
//   console.log('in page2 now');
//   // $().ready(() => {
//   $.ajax('data/page-2.json', {method:'GET', dataType: 'JSON'})
//     .then( eleObj => {
//       console.log('in ajax part');
//       eleObj.forEach(element => {
//         (new Animal(element).render());
//         populateArrKeywords(element.keyword);
//       });
//       populateDropbox();
//     })
//   // });
// }

// function populateDropbox() {
//   arrKeywords.forEach(key => {
//     let $option = $(`<option class="${key}">${key}</option>`);
//     $('#list').append($option);
//   });
// }

// Event listener

// $(() => {
//   $('select').on('change', function() {
//     // console.log(this.value);
//     if (this.value === 'all') {
//       $('section').show();
//       $('#photo-template').hide();
//     } else if (this.value !== 'default') {
//       $('section').hide();
//       $(`section[id="${this.value}"]`).show();
//     }
//   });
// });


