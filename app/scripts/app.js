import svg4everybody from 'svg4everybody';
import $ from 'jquery';

$(() => {
	svg4everybody();
});

// import '../blocks/test/test';
import angular from 'angular';
import '../blocks/d3/d3';
import '../blocks/d3/directives.js';

angular.module('kitApp', ['d3', 'kitApp.directives']);

