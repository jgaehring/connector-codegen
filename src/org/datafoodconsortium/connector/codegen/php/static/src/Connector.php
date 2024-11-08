<?php

namespace DataFoodConsortium\Connector;

use \VirtualAssembly\Semantizer\Semantizer;
use \VirtualAssembly\Semantizer\Semanticable;
use \VirtualAssembly\Semantizer\IFactory;

class Connector implements IConnector {

    private Semantizer $semantizer;
    private Array $context;

    /**
     * Observers that will be notified whenever certain methods are called.
     * Those methods are treated as events and explicitly made visible as public
     * constants below, so that observers may reference them.
     */
    private $observers = [];
    public const EVENT_WILDCARD = "*";
    public const EVENT_EXPORT = "export";
    public const EVENT_IMPORT = "import";

    public function __construct() {
        $this->semantizer = new Semantizer();
        $this->setFactory(new ConnectorFactory($this));
        $this->setPrefix("dfc-b", "https://github.com/datafoodconsortium/ontology/releases/latest/download/DFC_BusinessOntology.owl#");
        $this->setPrefix("dfc-f", "https://github.com/datafoodconsortium/taxonomies/releases/latest/download/facets.rdf#");
        $this->setPrefix("dfc-m", "https://github.com/datafoodconsortium/taxonomies/releases/latest/download/measures.rdf#");
        $this->setPrefix("dfc-pt", "https://github.com/datafoodconsortium/taxonomies/releases/latest/download/productTypes.rdf#");
        $this->setPrefix("dfc-v", "https://github.com/datafoodconsortium/taxonomies/releases/latest/download/vocabulary.rdf#");
        $this->context = ["https://www.datafoodconsortium.org"];

        // Create an empty store for each supported method/event declared above.
        $reflector = new \ReflectionClass($this);
        foreach ($reflector->getConstants() as $key => $c) {
            if (str_starts_with($key, "EVENT_")) {
                $this->observers[$c] = new \SplObjectStorage();
            }
        }

        /**
         * If DataCapture is enabled in the environmental variables, attach the
         * observer automatically. This should eventually be externalized rather
         * than calling it here in the constructor.
         */
        if ($_ENV["EXPERIMENTAL_DATA_CAPTURE_ENABLED"]) {
            $observer = new DataCapure($_ENV["EXPERIMENTAL_DATA_CAPTURE_EXPORT_URL"]);
            $this->attach($observer);
        }
    }

    public function setFactory(IFactory $factory): void {
        $this->getSemantizer()->setFactory($factory);
    }

    public function getFactory(): IFactory {
        $this->getSemantizer()->getFactory();
    }

    public function setFetchFunction(\Closure $fetch): void {
        $this->getSemantizer()->setFetchFunction($fetch);
    }

    public function getFetchFunction(): \Closure {
        $this->getSemantizer()->getFetchFunction();
    }

    public function getSemantizer(): Semantizer {
        return $this->semantizer;
    }

    public function setPrefix(string $prefix, string $uri): void {
        $this->getSemantizer()->setPrefix($prefix, $uri);
    }

    public function getContext(): Array {
        return $this->context;
    }

    public function setContext(Array $context): void {
        $this->context = $context;
    }

    public function export(Array $objects, Array $context = null): string {
        $context = $context? $context: $this->context;
        $json = $this->getSemantizer()->export($objects, $context);
        $this->notify(self::EVENT_EXPORT, $json, $objects, $context);
        return $json;
    }

    public function fetch(string $semanticId): Semanticable {
        $expanded = $this->getSemantizer()->expand($semanticId); // allow to use prefixed id, like "dfc-m:Kilogram".
        return $this->getSemantizer()->fetch($expanded);
    }

    /**
     * The data can be supplied directly as string, by passing a file
     * path, or by passing a URL.
     */
    public function import(string $data, string $baseUri = null): Array {
        $result = $this->getSemantizer()->import($data, $baseUri);
        $this->notify(self::EVENT_IMPORT, $result, $data, $baseUri);
        return $result;
    }

    /**
     * Implement SplSubject interface from standard library:
     * @see https://www.php.net/manual/en/class.splsubject.php
     * Adapted for multiple event observers based on:
     * @link https://refactoring.guru/design-patterns/observer/php/example#example-s1
     */
    private function initEventGroup(string $event = self::EVENT_WILDCARD): bool {
        $reflector = new \ReflectionClass($this);
        $isValid =  $reflector->hasConstant($event);
        if (!isset($this->observers[$event]) && $isValid) {
            $this->observers[$event] = new \SplObjectStorage;
            return true;
        }
        return $isValid;
    }

    private function getEventObservers(string $event = self::EVENT_WILDCARD): array {
        $isValid = $this->initEventGroup($event);
        $eventObservers = [];
        if (!$isValid) return $eventObservers;

        foreach ($this->observers[$event] as $observer) {
            $eventObservers[] = $observer;
        }
        if ($event === self::EVENT_WILDCARD) return $eventObservers;

        foreach ($this->observers[self::EVENT_WILDCARD] as $observer) {
            $eventObservers[] = $observer;
        }
        return $eventObservers;
    }

    public function attach(\SplObserver $observer, string $event = self::EVENT_WILDCARD): void {
        $isValid = $this->initEventGroup($event);
        if ($isValid) $this->observers[$event][] = $observer;
    }

    public function detach(\SplObserver $observer, string $event = self::EVENT_WILDCARD): void {
        foreach ($this->getEventObservers($event) as $key => $s) {
            if ($s === $observer) {
                unset($this->observers[$event][$key]);
            }
        }
    }

    public function notify(string $event = self::EVENT_WILDCARD, $data = null, ...$other): void {
        foreach ($this->getEventObservers($event) as $observer) {
            $observer->update($this, $event, $data, ...$other);
        }
    }

}
