/* global angular */

// import *as d3 from 'd3';

angular.module('d3', []).factory('d3Factory',
	['$document', '$rootScope', '$window', '$q',
		($document, $rootScope, $window, $q) => {
			// $$ private var
			// logic work
			// $document - это обертка над window.document
			// $rootScope - корневая модель приложения
			// $q - обещание (Promises)

			// Асинхронизм в JS
			// Callback's - ES5
			// Promises - ES2015
			// Generators - ES2015
			// Async/await - ES7 - пришел из С#, babel.js
			// d - deferred - отложженый (результать будет в будущем)
			const d = $q.defer();
			const scriptTag = $document[0].createElement('script');
			scriptTag.async = true;
			scriptTag.type = 'text/javascript';
			scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js';
			console.log(scriptTag);
			scriptTag.onload = () => {$rootScope.$apply(() => {d.resolve($window.d3);});};
			const b = $document[0].getElementsByTagName('body')[0];
			b.appendChild(scriptTag);
			return {d3: () => {return d.promise;}};
		}]);

