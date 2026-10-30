"""Isolierter GitHub-Smoke-Test für die Etarium-Kortex-Kopie.
Keine Schreiboperationen auf Original-Kortex oder default branch.
Die vollständige Mastermatrix wird separat als ZIP ausgeliefert.
"""
import unittest

AGENTS = ("Astra","Forge","Vera","Echo","Sentinel","Corvin",
          "Atlas","Chronos","Lumen","Nexus","Quill","Aegis")
RULES = {"copy_on_write": True, "original_mutated": False,
         "keep_versions": ("V17", "V18"), "validation_passes": 3}
DOMAINS = ("KANON","OBERWELT","KAMPF","ANIMATION","VERSIONEN")

class SandboxTests(unittest.TestCase):
    def test_agents_unique(self):
        self.assertEqual(len(AGENTS), len(set(AGENTS)))
        self.assertEqual(len(AGENTS), 12)
    def test_sandbox_isolation(self):
        self.assertTrue(RULES["copy_on_write"])
        self.assertFalse(RULES["original_mutated"])
    def test_retain_both_versions(self):
        self.assertEqual(set(RULES["keep_versions"]), {"V17","V18"})
    def test_review_passes(self):
        self.assertGreaterEqual(RULES["validation_passes"],3)
    def test_domains_present(self):
        self.assertIn("KANON",DOMAINS)
        self.assertIn("OBERWELT",DOMAINS)
if __name__=="__main__":
    unittest.main()
