/* global angular */
angular.module('kitApp.directives', [])
	.directive('kitEditor', require('../d3/kitEditor'))
	.directive('kitCustomShape', require('../d3/kitCustomShape'))
	.directive('kitRect', require('../d3/kitRect'))
	.directive('kitT', require('../d3/kitT'))
	.directive('kitGear', require('../d3/kitGear'))
	.directive('kitTriangle', require('../d3/kitTriangle'))
	.directive('kitScrew', require('../d3/kitScrew'));
